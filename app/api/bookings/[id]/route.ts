import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Booking, { BookingStatus } from '@/models/Booking';
import { Types } from 'mongoose';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const { id } = params;

    // 驗證 ID 格式
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: '無效的預約 ID' },
        { status: 400 }
      );
    }

    // 查詢預約
    const booking = await Booking
      .findById(id)
      .populate('courseId', 'title description category duration price')
      .lean();

    if (!booking) {
      return NextResponse.json(
        { success: false, message: '預約不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Booking fetch error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: '獲取預約資料失敗',
        error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : '未知錯誤' : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const { id } = params;
    const updateData = await request.json();

    // 驗證 ID 格式
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: '無效的預約 ID' },
        { status: 400 }
      );
    }

    // 查詢預約
    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json(
        { success: false, message: '預約不存在' },
        { status: 404 }
      );
    }

    // 處理狀態更新
    if (updateData.status) {
      if (!Object.values(BookingStatus).includes(updateData.status)) {
        return NextResponse.json(
          { success: false, message: '無效的狀態值' },
          { status: 400 }
        );
      }

      // 直接更新狀態
      booking.status = updateData.status;
      
      // 根據狀態更新時間戳記（如果存在的話）
      if (updateData.status === BookingStatus.CONFIRMED) {
        if (booking.confirmedAt !== undefined) booking.confirmedAt = new Date();
        if (booking.confirmedBy !== undefined && updateData.confirmedBy) {
          booking.confirmedBy = updateData.confirmedBy;
        }
      } else if (updateData.status === BookingStatus.CANCELLED) {
        if (booking.cancelledAt !== undefined) booking.cancelledAt = new Date();
        if (booking.cancelledReason !== undefined && updateData.cancelledReason) {
          booking.cancelledReason = updateData.cancelledReason;
        }
      }
      
      await booking.save();

      return NextResponse.json({
        success: true,
        message: '預約狀態已更新',
        data: booking
      });
    }

    // 處理一般欄位更新
    const allowedUpdates = [
      'customerName', 'customerEmail', 'customerPhone', 'customerNote',
      'bookingDate', 'startTime', 'endTime', 'participantCount'
    ];

    const updates: Record<string, unknown> = {};
    Object.keys(updateData).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = updateData[key];
      }
    });

    // 如果是更新時間相關資訊，需要檢查衝突
    if (updates.bookingDate || updates.startTime || updates.endTime) {
      const checkDate = updates.bookingDate ? new Date(updates.bookingDate as string) : (booking.bookingDate ? new Date(booking.bookingDate) : new Date());
      const checkStartTime = (updates.startTime || booking.startTime) as string;
      const checkEndTime = (updates.endTime || booking.endTime) as string;

      if (booking.courseId && checkDate && checkStartTime && checkEndTime) {
        const hasConflict = await Booking.checkTimeConflict(
          booking.courseId.toString(),
          checkDate,
          checkStartTime,
          checkEndTime,
          (booking._id as string).toString()
        );

        if (hasConflict) {
          return NextResponse.json(
            { success: false, message: '此時段已被其他預約佔用' },
            { status: 400 }
          );
        }
      }
    }

    // 更新預約
    Object.assign(booking, updates);
    await booking.save();

    return NextResponse.json({
      success: true,
      message: '預約資料已更新',
      data: booking
    });

  } catch (error) {
    console.error('Booking update error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: '更新預約失敗',
        error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : '未知錯誤' : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const { id } = params;

    // 驗證 ID 格式
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: '無效的預約 ID' },
        { status: 400 }
      );
    }

    // 查詢預約
    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json(
        { success: false, message: '預約不存在' },
        { status: 404 }
      );
    }

    // 檢查是否可以刪除（通常只允許刪除待確認或已取消的預約）
    if (![BookingStatus.PENDING, BookingStatus.CANCELLED].includes(booking.status)) {
      return NextResponse.json(
        { success: false, message: '此預約狀態無法刪除' },
        { status: 400 }
      );
    }

    // 刪除預約
    await Booking.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: '預約已刪除'
    });

  } catch (error) {
    console.error('Booking delete error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: '刪除預約失敗',
        error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : '未知錯誤' : undefined
      },
      { status: 500 }
    );
  }
}