import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Testimonial, { ITestimonial } from '@/models/TestimonialMongoose';
import { handleApiError } from '@/lib/api-types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
      return NextResponse.json({ error: '未授權訪問' }, { status: 401 });
    }

    await connectToDatabase();
    const testimonial = await Testimonial.findById(params.id).lean();
    
    if (!testimonial) {
      return NextResponse.json({ error: '見證不存在' }, { status: 404 });
    }

    return NextResponse.json({ testimonial });

  } catch (error) {
    console.error('獲取見證詳情失敗:', error);
    return NextResponse.json({ error: '獲取見證詳情失敗' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
      return NextResponse.json({ error: '未授權訪問' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();

    // 準備更新資料
    const updateData: Partial<ITestimonial> = {};
    
    if (body.memberName !== undefined) updateData.memberName = body.memberName;
    if (body.age !== undefined) updateData.age = body.age;
    if (body.occupation !== undefined) updateData.occupation = body.occupation;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.rating !== undefined) updateData.rating = body.rating;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.beforeImageUrl !== undefined) updateData.beforeImageUrl = body.beforeImageUrl;
    if (body.afterImageUrl !== undefined) updateData.afterImageUrl = body.afterImageUrl;
    if (body.isPublished !== undefined) updateData.isPublished = body.isPublished;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.trainingPeriod !== undefined) updateData.trainingPeriod = body.trainingPeriod;
    if (body.achievements !== undefined) updateData.achievements = body.achievements;
    if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder;

    const testimonial = await Testimonial.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!testimonial) {
      return NextResponse.json({ error: '見證不存在' }, { status: 404 });
    }

    return NextResponse.json({ testimonial });

  } catch (error: unknown) {
    const { message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
      return NextResponse.json({ error: '未授權訪問' }, { status: 401 });
    }

    await connectToDatabase();

    const testimonial = await Testimonial.findById(params.id);
    if (!testimonial) {
      return NextResponse.json({ error: '見證不存在' }, { status: 404 });
    }

    const deleted = await Testimonial.findByIdAndDelete(params.id);
    
    if (!deleted) {
      return NextResponse.json({ error: '刪除見證失敗' }, { status: 500 });
    }

    return NextResponse.json({ message: '見證已成功刪除' });

  } catch (error) {
    console.error('刪除見證失敗:', error);
    return NextResponse.json({ error: '刪除見證失敗' }, { status: 500 });
  }
}