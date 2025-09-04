import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { sendBookingEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { 
          success: false, 
          message: '缺少預約編號'
        },
        { status: 400 }
      );
    }

    // 查找預約記錄
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { 
          success: false, 
          message: '找不到預約記錄'
        },
        { status: 404 }
      );
    }

    // 確認預約
    await booking.confirm();

    // 發送確認郵件
    try {
      const bookingObject = booking.toObject();
      
      await sendBookingEmail({
        bookingType: booking.bookingType,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        customerNote: booking.customerNote,
        bookingNumber: booking.bookingNumber,
        totalPrice: booking.totalPrice,
        participantCount: booking.participantCount,
        createdAt: booking.createdAt.toISOString(),
        courseStartDate: bookingObject.courseStartDate?.toISOString(),
        courseEndDate: bookingObject.courseEndDate?.toISOString(),
        bookingDate: bookingObject.bookingDate?.toISOString(),
        startTime: booking.startTime,
        endTime: booking.endTime,
        courseName: booking.courseName,
        courseCategory: booking.courseCategory,
        customerGender: booking.customerGender,
        customerAge: booking.customerAge,
        hasExperience: booking.hasExperience,
        fitnessGoals: booking.fitnessGoals,
        preferredDate: booking.preferredDate,
        preferredTime: booking.preferredTime
      });
    } catch (emailError) {
      console.error('發送確認郵件失敗:', emailError);
      // 郵件發送失敗不應該影響預約確認
    }

    return NextResponse.json({
      success: true,
      message: '預約已確認！確認信已發送到您的信箱',
      data: {
        bookingNumber: booking.bookingNumber,
        status: booking.status
      }
    });

  } catch (error) {
    console.error('預約確認錯誤:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: '確認預約失敗，請稍後再試或聯繫客服',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : '未知錯誤') : undefined
      },
      { status: 500 }
    );
  }
}