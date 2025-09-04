import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Testimonial from '@/models/TestimonialMongoose';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
      return NextResponse.json({ error: '未授權訪問' }, { status: 401 });
    }

    const { updates } = await request.json();

    if (!Array.isArray(updates)) {
      return NextResponse.json({ error: '更新資料格式錯誤' }, { status: 400 });
    }

    const validUpdates = updates.filter(update => 
      update.id && typeof update.sortOrder === 'number'
    );

    if (validUpdates.length === 0) {
      return NextResponse.json({ error: '沒有有效的更新資料' }, { status: 400 });
    }

    // 使用 Mongoose 批量更新
    const updatePromises = validUpdates.map(update => 
      Testimonial.findByIdAndUpdate(update.id, { sortOrder: update.sortOrder })
    );
    await Promise.all(updatePromises);
    const success = true;

    if (!success) {
      return NextResponse.json({ error: '更新排序失敗' }, { status: 500 });
    }

    return NextResponse.json({ message: '排序更新成功' });

  } catch (error) {
    console.error('更新見證排序失敗:', error);
    return NextResponse.json({ error: '更新見證排序失敗' }, { status: 500 });
  }
}