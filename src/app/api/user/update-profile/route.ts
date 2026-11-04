import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import { requireAuth } from '@/lib/auth';
import { isValidObjectId } from '@/lib/regex';

export async function PUT(req: Request) {
  try {
    const { payload, response: authError } = await requireAuth();
    if (authError) return authError;

    await connectDB();

    const body = await req.json();

    const isPrivileged = ['Admin', 'President'].includes(payload!.role);
    const targetUserId = (isPrivileged && (body.userId || body.targetUserId))
      ? String(body.userId || body.targetUserId)
      : payload!.userId;

    if (!isValidObjectId(targetUserId)) {
      return NextResponse.json({ success: false, message: 'Invalid target user ID' }, { status: 400 });
    }

    const {
      name,
      rollNo,
      branch,
      year,
      batch,
      bio,
      portfolio,
      resume,
      phone,
      cgpa,
      availability,
      company,
      currentRole,
      graduationYear,
      location,
      skills,
      interests,
      linkedin,
      github,
      instagram,
      twitter,
      team,
      designation,
      isPublic,
      status,
    } = body;

    const updateDoc: Record<string, any> = {};

    if (name !== undefined) updateDoc.name = name;
    if (rollNo !== undefined) updateDoc.rollNo = rollNo;
    if (branch !== undefined) updateDoc.branch = branch;
    if (year !== undefined) updateDoc.year = year;
    if (bio !== undefined) updateDoc.bio = bio;
    if (portfolio !== undefined) updateDoc.portfolio = portfolio;
    if (resume !== undefined) updateDoc.resume = resume;
    if (phone !== undefined) updateDoc.phone = phone;
    if (cgpa !== undefined) updateDoc.cgpa = cgpa;
    if (availability !== undefined) updateDoc.availability = availability;
    if (company !== undefined) updateDoc.company = company;
    if (currentRole !== undefined) updateDoc.currentRole = currentRole;
    if (location !== undefined) updateDoc.location = location;
    if (batch !== undefined) updateDoc.batch = Number(batch) || null;
    if (graduationYear !== undefined) updateDoc.graduationYear = Number(graduationYear) || null;

    if (skills !== undefined) {
      updateDoc.skills = Array.isArray(skills)
        ? skills
        : String(skills).split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    if (interests !== undefined) {
      updateDoc.interests = Array.isArray(interests)
        ? interests
        : String(interests).split(',').map((s: string) => s.trim()).filter(Boolean);
    }

    // Social Links
    const currentTarget = await User.findById(targetUserId).select('socialLinks role');
    if (!currentTarget) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    updateDoc.socialLinks = {
      ...(currentTarget.socialLinks || {}),
      ...(linkedin !== undefined ? { linkedin } : {}),
      ...(github !== undefined ? { github } : {}),
      ...(instagram !== undefined ? { instagram } : {}),
      ...(twitter !== undefined ? { twitter } : {}),
    };

    // Privileged overrides
    if (isPrivileged) {
      if (team !== undefined) updateDoc.team = team;
      if (designation !== undefined) updateDoc.designation = designation;
      if (isPublic !== undefined) updateDoc.isPublic = Boolean(isPublic);
      if (status !== undefined) updateDoc.status = status;
    }

    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      { $set: updateDoc },
      { new: true, runValidators: true }
    ).select('-password');

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update Profile Error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update profile',
      },
      { status: 500 }
    );
  }
}
