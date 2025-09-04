import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('GET booking API called with ID:', params.id);
    
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
      console.log('Unauthorized access attempt');
      return NextResponse.json({ error: '未授權訪問' }, { status: 401 });
    }

    await connectToDatabase();
    console.log('Database connected, searching for booking...');

    // 驗證 ObjectId 格式
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      console.log('Invalid ObjectId format:', params.id);
      return NextResponse.json({ error: '無效的預約ID格式' }, { status: 400 });
    }

    const booking = await Booking.findById(params.id)
      .populate('courseId', 'title weekdays timeSlots category startDate endDate')
      .lean();
    
    console.log('Booking search result:', booking ? 'Found' : 'Not found');
    
    if (!booking) {
      console.log('Booking not found with ID:', params.id);
      return NextResponse.json({ error: '預約不存在' }, { status: 404 });
    }

    // 將資料轉換為適合前端的格式（booking 已經是 lean 對象）
    const bookingData = booking as unknown as {
      _id: string;
      bookingType: string;
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      courseId?: {
        _id: string;
        title: string;
        weekdays: number[];
        timeSlots: { startTime: string; endTime: string }[];
        category: string;
        startDate: string;
        endDate: string;
      };
      [key: string]: unknown;
    };
    
    const bookingResponse = {
      ...bookingData,
      course: bookingData.courseId,
    };
    
    // 移除不需要的 courseId 欄位
    delete bookingResponse.courseId;

    return NextResponse.json({ booking: bookingResponse });

  } catch (error) {
    console.error('Get booking error:', error);
    return NextResponse.json({ error: '獲取預約詳情失敗' }, { status: 500 });
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

    const booking = await Booking.findById(params.id);
    
    if (!booking) {
      return NextResponse.json({ error: '預約不存在' }, { status: 404 });
    }

    // 更新狀態
    if (body.status !== undefined) {
      booking.status = body.status;
      
      if (body.status === 'confirmed') {
        booking.confirmedAt = new Date();
        booking.confirmedBy = session.user.name || session.user.email;
      } else if (body.status === 'cancelled') {
        booking.cancelledAt = new Date();
        if (body.cancelledReason) {
          booking.cancelledReason = body.cancelledReason;
        }
      }
    }

    await booking.save();

    return NextResponse.json({ 
      message: '預約狀態更新成功',
      booking 
    });

  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json({ error: '更新預約狀態失敗' }, { status: 500 });
  }
}

export async function PATCH(
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
    const { status, cancelledReason, confirmedBy } = body;

    const booking = await Booking.findById(params.id);
    
    if (!booking) {
      return NextResponse.json({ error: '預約不存在' }, { status: 404 });
    }

    // 更新狀態和相關欄位
    booking.status = status;
    
    if (status === 'confirmed') {
      booking.confirmedAt = new Date();
      booking.confirmedBy = confirmedBy || session.user.name || session.user.email;
    } else if (status === 'cancelled') {
      booking.cancelledAt = new Date();
      if (cancelledReason) {
        booking.cancelledReason = cancelledReason;
      }
    }

    await booking.save();

    return NextResponse.json({ 
      message: '預約狀態更新成功',
      booking 
    });

  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json({ error: '更新預約狀態失敗' }, { status: 500 });
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

    const booking = await Booking.findById(params.id);
    
    if (!booking) {
      return NextResponse.json({ error: '預約不存在' }, { status: 404 });
    }

    await Booking.findByIdAndDelete(params.id);

    return NextResponse.json({ message: '預約刪除成功' });

  } catch (error) {
    console.error('Delete booking error:', error);
    return NextResponse.json({ error: '刪除預約失敗' }, { status: 500 });
  }
}