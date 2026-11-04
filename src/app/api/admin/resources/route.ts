import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Resource } from '@/models/Resource';
import { requireAuth, requireRole } from '@/lib/auth';
import type { QueryFilter } from 'mongoose';
import type { IResource } from '@/types/models';
import { escapeRegex, isValidObjectId } from '@/lib/regex';


import { getErrorMessage } from '@/lib/errors';
export const dynamic = 'force-dynamic';

const CONTENT_MANAGERS = ['Admin', 'President', 'OfficeBearer'] as const;

// ─── GET: Fetch Resources + Live Aggregated Analytics ────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { response: authError } = await requireAuth();
    if (authError) return authError;

    await connectDB();
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const semester = searchParams.get('semester');

    const filter: QueryFilter<IResource> = {};
    if (department && department !== 'All') filter.department = department;
    if (semester && semester !== 'All') filter.semester = Number(semester);

    const resources = await Resource.find(filter).sort({ subjectName: 1 }).lean<IResource[]>();
    
    // Global Accumulators live metrics pull karne ke liye
    const allResources = await Resource.find({}).lean<IResource[]>();
    
    const deptMap: Record<string, { notes: number; pyqs: number; total: number }> = {};
    let aggregatedViews = 0;
    let aggregatedDownloads = 0;

    allResources.forEach((res) => {
      const dName = res.department;
      if (!deptMap[dName]) {
        deptMap[dName] = { notes: 0, pyqs: 0, total: 0 };
      }
      res.files?.forEach((f) => {
        deptMap[dName].total++;
        if (f.type === 'Note') deptMap[dName].notes++;
        if (f.type === 'PYQ') deptMap[dName].pyqs++;
        
        // Accumulate analytics hits metrics
        aggregatedViews += (f.views || 0);
        aggregatedDownloads += (f.downloads || 0);
      });
    });

    const chartData = Object.entries(deptMap).map(([name, stats]) => ({
      name,
      Notes: stats.notes,
      PYQs: stats.pyqs,
      Total: stats.total
    }));

    // Dynamic timeline chart mock framework parameters (Aap database logs timeline bhi parse kar sakte hain)
    const trafficTimeline = [
      { name: 'Wk 1', Views: Math.round(aggregatedViews * 0.4), Downloads: Math.round(aggregatedDownloads * 0.4) },
      { name: 'Wk 2', Views: Math.round(aggregatedViews * 0.6), Downloads: Math.round(aggregatedDownloads * 0.6) },
      { name: 'Wk 3', Views: Math.round(aggregatedViews * 0.8), Downloads: Math.round(aggregatedDownloads * 0.8) },
      { name: 'Live Now', Views: aggregatedViews, Downloads: aggregatedDownloads },
    ];

    return NextResponse.json({ 
      success: true, 
      resources, 
      chartData,
      traffic: {
        views: aggregatedViews,
        downloads: aggregatedDownloads,
        timeline: trafficTimeline
      }
    });
  } catch (error){
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

// ─── POST: Document Upload Entry Ingestion Pipeline ──────────────────────────
export async function POST(request: NextRequest) {
  try {
    // Team Leaders & Team Members may upload too; ownership is stamped so they can manage only their own files.
    const { payload, response: authError } = await requireRole([...CONTENT_MANAGERS, 'TeamLeader', 'TeamMember']);
    if (authError) return authError;

    await connectDB();
    const body = await request.json();
    const { department, semester, subjectName, subjectCode, fileTitle, fileUrl, fileType } = body;

    if (!department || !semester || !subjectName || !fileTitle || !fileUrl || !fileType) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
    }

    let resource = await Resource.findOne({
      department,
      semester: Number(semester),
      subjectName: { $regex: new RegExp(`^${escapeRegex(subjectName)}$`, 'i') }
    });

    const newFilePayload = { title: fileTitle, fileUrl, type: fileType, views: 0, downloads: 0, uploadedBy: payload!.userId };

    if (resource) {
      resource.files.push(newFilePayload);
      await resource.save();
    } else {
      resource = await Resource.create({
        department,
        semester: Number(semester),
        subjectName: subjectName.trim(),
        subjectCode: subjectCode || '',
        files: [newFilePayload]
      });
    }

    return NextResponse.json({ success: true, resource }, { status: 201 });
  } catch (error){
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

// ─── PATCH: Atomic Multi-Action Traffic Analytics Aggregator ─────────────────
export async function PATCH(request: NextRequest) {
  try {
    // View/download counters are incremented by any signed-in viewer, not just managers.
    const { response: authError } = await requireAuth();
    if (authError) return authError;

    await connectDB();
    const { fileId, actionType } = await request.json(); // actionType: 'views' | 'downloads'

    if (!fileId || !isValidObjectId(fileId) || !['views', 'downloads'].includes(actionType)) {
      return NextResponse.json({ success: false, error: 'Invalid operation parameters' }, { status: 400 });
    }

    // Atomic Mongoose operational sub-document mapping syntax increment array targets safely
    const fieldToIncrement = actionType === 'views' ? 'files.$.views' : 'files.$.downloads';
    
    const result = await Resource.findOneAndUpdate(
      { "files._id": fileId },
      { $inc: { [fieldToIncrement]: 1 } },
      { new: true }
    );

    if (!result) {
      return NextResponse.json({ success: false, error: 'Target file structure node missing' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error){
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

// ─── PUT: Admin updates subject details or a specific file ───────────────────
export async function PUT(request: NextRequest) {
  try {
    const { response: authError } = await requireRole([...CONTENT_MANAGERS]);
    if (authError) return authError;

    await connectDB();
    const body = await request.json();
    const { id, fileId, department, semester, subjectName, subjectCode, fileTitle, fileUrl, fileType } = body;

    // A. Update specific file inside a resource
    if (fileId && isValidObjectId(fileId)) {
      const resource = await Resource.findOne({ 'files._id': fileId });
      if (!resource) return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 });
      const file = resource.files.id(fileId);
      if (!file) return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 });

      if (fileTitle !== undefined) file.title = fileTitle;
      if (fileUrl !== undefined) file.fileUrl = fileUrl;
      if (fileType !== undefined) file.type = fileType;

      await resource.save();
      return NextResponse.json({ success: true, resource });
    }

    // B. Update resource subject metadata
    if (id && isValidObjectId(id)) {
      const updateDoc: Record<string, any> = {};
      if (department !== undefined) updateDoc.department = department;
      if (semester !== undefined) updateDoc.semester = Number(semester);
      if (subjectName !== undefined) updateDoc.subjectName = subjectName.trim();
      if (subjectCode !== undefined) updateDoc.subjectCode = subjectCode.trim();

      const resource = await Resource.findByIdAndUpdate(id, { $set: updateDoc }, { new: true });
      if (!resource) return NextResponse.json({ success: false, error: 'Resource not found' }, { status: 404 });
      return NextResponse.json({ success: true, resource });
    }

    return NextResponse.json({ success: false, error: 'Resource id or fileId required' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

// ─── DELETE: Admin deletes a resource subject or specific file ───────────────
export async function DELETE(request: NextRequest) {
  try {
    const { response: authError } = await requireRole([...CONTENT_MANAGERS]);
    if (authError) return authError;

    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const fileId = searchParams.get('fileId');

    // A. Delete specific file
    if (fileId && isValidObjectId(fileId)) {
      const resource = await Resource.findOneAndUpdate(
        { 'files._id': fileId },
        { $pull: { files: { _id: fileId } } },
        { new: true }
      );
      if (!resource) return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 });
      return NextResponse.json({ success: true });
    }

    // B. Delete entire subject
    if (id && isValidObjectId(id)) {
      const deleted = await Resource.findByIdAndDelete(id);
      if (!deleted) return NextResponse.json({ success: false, error: 'Resource not found' }, { status: 404 });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Target id or fileId required' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}