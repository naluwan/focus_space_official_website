import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
      return NextResponse.json({ error: '未授權訪問' }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const query: Record<string, unknown> = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (type && type !== 'all') {
      query.bookingType = type;
    }
    
    if (search && search.trim()) {
      query.$or = [
        { customerName: { $regex: search.trim(), $options: 'i' } },
        { customerEmail: { $regex: search.trim(), $options: 'i' } },
        { customerPhone: { $regex: search.trim(), $options: 'i' } },
        { bookingNumber: { $regex: search.trim(), $options: 'i' } },
        { courseName: { $regex: search.trim(), $options: 'i' } }
      ];
    }
    
    if (startDate || endDate) {
      query.createdAt = {} as { $gte?: Date; $lte?: Date };
      if (startDate) {
        (query.createdAt as { $gte?: Date; $lte?: Date }).$gte = new Date(startDate);
      }
      if (endDate) {
        (query.createdAt as { $gte?: Date; $lte?: Date }).$lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;
    
    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Booking.countDocuments(query)
    ]);

    // 如果沒有分頁參數，返回所有預約
    if (!searchParams.has('page')) {
      // Returning all bookings without pagination
      return NextResponse.json(bookings);
    }
    
    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: unknown) {
    console.error('Get bookings error:', error);
    return NextResponse.json({ error: '獲取預約列表失敗' }, { status: 500 });
  }
}