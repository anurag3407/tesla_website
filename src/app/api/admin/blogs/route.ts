import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Blog } from '@/models/Blog';
import '@/models/User';

export async function GET() {
  try {
    await connectDB();

    const blogs = await Blog.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      blogs
    });

  } catch (error) {
      console.error('ADMIN BLOG ERROR:', error);

      return NextResponse.json({
        success: false,
        error: String(error)
      });
    }
}