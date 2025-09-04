import { NextResponse } from 'next/server';
import Course from '@/models/CourseMongoose';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    // 確保 MongoDB 連接
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    const featured = searchParams.get('featured') === 'true';

    // 只獲取已啟用的課程，按顯示順序排序
    const courses = await Course.find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .limit(featured ? 4 : limit);

    return NextResponse.json({
      success: true,
      data: courses,
      total: courses.length
    });
  } catch (error) {
    console.error('[Courses API] Error fetching courses:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch courses'
    }, { status: 500 });
  }
}