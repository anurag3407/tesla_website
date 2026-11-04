import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import { Blog } from '@/models/Blog';
import { Event } from '@/models/Event';
import { Resource } from '@/models/Resource';
import type { IBlog, IEvent, IResource, IUser } from '@/types/models';
import { requireAuth } from '@/lib/auth';
import { isValidObjectId } from '@/lib/regex';
import { getErrorMessage } from '@/lib/errors';

// ─── GET: read-only profile dataset for any member by id ───
export async function GET(_request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { payload, response: authError } = await requireAuth();
    if (authError) return authError;

    const { userId } = await params;
    if (!isValidObjectId(userId)) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    await connectDB();

    const userDoc = await User.findById(userId).select('-password').lean<IUser>();
    if (!userDoc) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    const user = userDoc;

    const blogsWritten = await Blog.countDocuments({ author: user._id });
    const approvedEvents = await Event.countDocuments({ registeredUsers: user._id });

    const sharedResources = await Resource.find({ 'files.uploadedBy': user._id }).lean<IResource[]>();
    let resourcesUploaded = 0;
    sharedResources.forEach((r) => {
      r.files?.forEach((f) => {
        if (f.uploadedBy?.toString() === user._id.toString()) resourcesUploaded++;
      });
    });

    const blogs = await Blog.find({ author: user._id }).sort({ createdAt: -1 }).limit(10).lean<IBlog[]>();
    const events = await Event.find({ registeredUsers: user._id }).sort({ date: -1 }).limit(10).lean<IEvent[]>();

    const isOwn = user._id.toString() === payload!.userId;
    const isPrivileged = ['Admin', 'President'].includes(payload!.role);

    const safeUser: Record<string, unknown> = {
      ...user,
      rollNumber: user.rollNumber || user.rollNo || '',
    };

    if (!isOwn && !isPrivileged) {
      delete safeUser.phone;
      delete safeUser.cgpa;
      delete safeUser.resume;
    }

    return NextResponse.json({
      success: true,
      isOwn,
      user: safeUser,
      stats: {
        blogsWritten,
        approvedEvents,
        resourcesUploaded,
        achievementsCount: user.achievements?.length || 0,
        skillsCount: user.skills?.length || 0,
        profileViews: 0,
      },
      blogs,
      events,
    });
  } catch (error){
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

// ─── PUT: Admin or Owner updates full profile dataset for this member ───
export async function PUT(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { payload, response: authError } = await requireAuth();
    if (authError) return authError;

    const { userId } = await params;
    if (!isValidObjectId(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }

    const isOwn = userId === payload!.userId;
    const isPrivileged = ['Admin', 'President'].includes(payload!.role);

    if (!isOwn && !isPrivileged) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();

    const allowedUpdates = [
      'name', 'email', 'phone', 'bio', 'rollNo', 'branch', 'year', 'batch',
      'company', 'currentRole', 'graduationYear', 'location', 'skills', 'interests',
      'portfolio', 'resume', 'availability', 'cgpa', 'currentSemester', 'socialLinks',
      'isPublic', 'status', 'designation', 'team'
    ];

    const updateDoc: Record<string, any> = {};
    for (const key of allowedUpdates) {
      if (body[key] !== undefined) {
        // Only privileged admins can change sensitive attributes
        if (['team', 'designation', 'status', 'email'].includes(key) && !isPrivileged) {
          continue;
        }
        updateDoc[key] = body[key];
      }
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: updateDoc },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updated) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: updated,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
