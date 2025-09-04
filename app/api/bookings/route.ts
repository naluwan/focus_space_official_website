import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Booking, { BookingType, BookingStatus, IBooking } from '@/models/Booking';
import { sendBookingEmail } from '@/lib/email-service';

// 定義課程預約的完整類型
interface CourseBooking extends IBooking {
  bookingType: BookingType.COURSE;
  courseName: string;
  courseCategory: 'personal' | 'group' | 'special';
  duration: number;
  courseRequirements?: string;
  courseFeatures?: string[];
  courseStartDate?: Date;
  courseEndDate?: Date;
  courseWeekdays?: number[];
  courseTimeSlots?: { startTime: string; endTime: string }[];
  bookingDate?: Date;
  startTime?: string;
  endTime?: string;
}

// 定義體驗預約的完整類型
interface TrialBooking extends IBooking {
  bookingType: BookingType.TRIAL;
  customerGender?: 'male' | 'female' | 'other';
  customerAge?: number;
  hasExperience?: boolean;
  fitnessGoals?: string;
  preferredDate?: string;
  preferredTime?: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const bookingData = await request.json();
    console.log('Received booking data:', bookingData);

    // 驗證必填欄位
    const validationErrors: Record<string, string> = {};

    // 通用必填欄位
    if (!bookingData.bookingType) {
      validationErrors.bookingType = '請選擇預約類型';
    }

    if (!bookingData.customerName?.trim()) {
      validationErrors.customerName = '請輸入姓名';
    }

    if (!bookingData.customerEmail?.trim()) {
      validationErrors.customerEmail = '請輸入電子郵件';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.customerEmail)) {
      validationErrors.customerEmail = '請輸入有效的電子郵件';
    }

    if (!bookingData.customerPhone?.trim()) {
      validationErrors.customerPhone = '請輸入電話號碼';
    } else if (!/^09\d{8}$/.test(bookingData.customerPhone)) {
      validationErrors.customerPhone = '請輸入有效的手機號碼（09xxxxxxxx）';
    }

    // 課程預約額外驗證
    if (bookingData.bookingType === 'course') {
      if (!bookingData.courseId) {
        validationErrors.course = '請選擇課程';
      }
      
      // 只有個人課程需要選擇日期和時間
      if (bookingData.courseCategory === 'personal') {
        if (!bookingData.bookingDate) {
          validationErrors.date = '請選擇預約日期';
        }
        if (!bookingData.startTime) {
          validationErrors.time = '請選擇預約時段';
        }

        // 檢查時段衝突
        if (bookingData.courseId && bookingData.bookingDate && bookingData.startTime && bookingData.endTime) {
          const hasConflict = await Booking.checkTimeConflict(
            bookingData.courseId,
            new Date(bookingData.bookingDate),
            bookingData.startTime,
            bookingData.endTime
          );
          
          if (hasConflict) {
            validationErrors.time = '此時段已被預約，請選擇其他時段';
          }
        }
      }
      // 團體課程使用預設的開始日期
      else if (bookingData.courseCategory === 'group' || bookingData.courseCategory === 'special') {
        // 團體課程不需要選擇時間，會使用課程的預設時間
        if (!bookingData.courseStartDate) {
          validationErrors.course = '此團體課程缺少開始日期資訊';
        }
      }
    }

    // 如果有驗證錯誤，返回錯誤
    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: '資料驗證失敗',
          errors: validationErrors
        },
        { status: 400 }
      );
    }

    // 產生預約編號
    const bookingNumber = await Booking.generateBookingNumber();

    // 準備預約資料
    const newBookingData = {
      bookingType: bookingData.bookingType,
      bookingNumber,
      
      // 客戶基本資訊
      customerName: bookingData.customerName.trim(),
      customerEmail: bookingData.customerEmail.trim().toLowerCase(),
      customerPhone: bookingData.customerPhone.trim(),
      customerNote: bookingData.customerNote?.trim() || '',
      
      // 預約詳情
      participantCount: bookingData.participantCount || 1,
      totalPrice: bookingData.totalPrice || 0,
      status: BookingStatus.PENDING
    };

    // 體驗預約專屬欄位
    if (bookingData.bookingType === 'trial') {
      const trialData: Record<string, string | number | boolean | undefined> = {};
      
      if (bookingData.customerGender && ['male', 'female', 'other'].includes(bookingData.customerGender)) {
        trialData.customerGender = bookingData.customerGender;
      }
      
      if (bookingData.customerAge && typeof bookingData.customerAge === 'number') {
        trialData.customerAge = bookingData.customerAge;
      }
      
      if (typeof bookingData.hasExperience === 'boolean') {
        trialData.hasExperience = bookingData.hasExperience;
      }
      
      if (bookingData.fitnessGoals && bookingData.fitnessGoals.trim()) {
        trialData.fitnessGoals = bookingData.fitnessGoals.trim();
      }
      
      if (bookingData.preferredDate && bookingData.preferredDate.trim()) {
        trialData.preferredDate = bookingData.preferredDate.trim();
      }
      
      if (bookingData.preferredTime) {
        trialData.preferredTime = bookingData.preferredTime;
      }
      
      Object.assign(newBookingData, trialData);
    }

    // 課程預約專屬欄位
    if (bookingData.bookingType === 'course') {
      // 確保課程預約有正確的價格
      const courseData: Record<string, string | number | Date | boolean | {startTime: string; endTime: string}[] | number[] | string[] | undefined> = {
        courseId: bookingData.courseId,
        courseName: bookingData.courseName,
        courseCategory: bookingData.courseCategory || undefined,
        duration: bookingData.duration || 60,
        allowLateEnrollment: bookingData.allowLateEnrollment || false,
        courseRequirements: bookingData.courseRequirements,
        courseFeatures: bookingData.courseFeatures
      };
      
      // 只有個人課程需要選擇日期和時間
      if (bookingData.courseCategory === 'personal') {
        if (bookingData.bookingDate) {
          const bookingDate = new Date(bookingData.bookingDate);
          bookingDate.setHours(12, 0, 0, 0); // 設為中午12點避免時區問題
          courseData.bookingDate = bookingDate;
        }
        courseData.startTime = bookingData.startTime;
        courseData.endTime = bookingData.endTime;
      } else {
        // 團體課程使用適當的預約日期
        if (bookingData.courseStartDate) {
          const courseStartDate = new Date(bookingData.courseStartDate);
          courseStartDate.setHours(0, 0, 0, 0);
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          // 如果課程已開始且允許插班，使用今天的日期
          // 否則使用課程開始日期
          if (today > courseStartDate && bookingData.allowLateEnrollment) {
            // 創建一個新的日期物件，確保時間是 00:00:00
            const bookingDate = new Date(today);
            bookingDate.setHours(12, 0, 0, 0); // 設為中午12點避免時區問題
            courseData.bookingDate = bookingDate;
          } else {
            const bookingDate = new Date(courseStartDate);
            bookingDate.setHours(12, 0, 0, 0); // 設為中午12點避免時區問題
            courseData.bookingDate = bookingDate;
          }
        }
        // 設置團體課程的時間（如果有提供）
        if (bookingData.courseTimeSlots && bookingData.courseTimeSlots.length > 0) {
          courseData.startTime = bookingData.courseTimeSlots[0].startTime;
          courseData.endTime = bookingData.courseTimeSlots[0].endTime;
        }
      }
      
      Object.assign(newBookingData, courseData);
    }

    // 創建預約記錄
    const booking = new Booking(newBookingData);
    await booking.save();
    
    console.log('Booking created successfully:', {
      bookingNumber: booking.bookingNumber,
      bookingId: String(booking._id),
      bookingType: booking.bookingType
    });

    // 發送預約確認郵件
    try {
      const emailData = {
        bookingType: booking.bookingType,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        createdAt: booking.createdAt.toISOString(),
        bookingNumber: booking.bookingNumber,
        customerNote: booking.customerNote,
        
        // 課程相關資料
        ...(booking.bookingType === 'course' && (() => {
          const courseBooking = booking as CourseBooking;
          return {
            courseName: courseBooking.courseName,
            courseCategory: courseBooking.courseCategory,
            duration: courseBooking.duration,
            totalPrice: booking.totalPrice,
            participantCount: booking.participantCount,
            courseStartDate: courseBooking.courseStartDate?.toISOString(),
            courseEndDate: courseBooking.courseEndDate?.toISOString(),
            courseWeekdays: courseBooking.courseWeekdays,
            courseTimeSlots: courseBooking.courseTimeSlots,
            bookingDate: courseBooking.bookingDate?.toISOString(),
            startTime: courseBooking.startTime,
            endTime: courseBooking.endTime,
            courseRequirements: courseBooking.courseRequirements,
            courseFeatures: courseBooking.courseFeatures,
          };
        })()),
        
        // 體驗相關資料
        ...(booking.bookingType === 'trial' && (() => {
          const trialBooking = booking as TrialBooking;
          return {
            customerGender: trialBooking.customerGender,
            customerAge: trialBooking.customerAge,
            hasExperience: trialBooking.hasExperience,
            fitnessGoals: trialBooking.fitnessGoals,
            preferredDate: trialBooking.preferredDate,
            preferredTime: trialBooking.preferredTime,
          };
        })()),
      };

      await sendBookingEmail(emailData);
      console.log('Booking confirmation email sent successfully');
    } catch (emailError) {
      console.error('Failed to send booking confirmation email:', emailError);
      // 不讓郵件發送失敗影響預約流程
    }

    return NextResponse.json({
      success: true,
      message: '預約成功！我們會盡快與您聯繫確認',
      data: {
        bookingNumber: booking.bookingNumber,
        bookingId: String(booking._id),
        customerEmail: booking.customerEmail
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Booking creation error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: '預約失敗，請稍後再試或聯繫客服',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const bookingType = searchParams.get('type');
    const search = searchParams.get('search');

    // 建立查詢條件
    const query: Record<string, unknown> = {};
    
    if (status && Object.values(BookingStatus).includes(status as BookingStatus)) {
      query.status = status;
    }
    
    if (bookingType && Object.values(BookingType).includes(bookingType as BookingType)) {
      query.bookingType = bookingType;
    }
    
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } },
        { bookingNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // 計算分頁
    const skip = (page - 1) * limit;
    
    // 查詢預約
    const bookings = await Booking
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('courseId', 'title category')
      .lean();

    // 計算總數
    const total = await Booking.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Booking fetch error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: '獲取預約資料失敗',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { status: 500 }
    );
  }
}

// 取得預約統計
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'stats') {
      const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined;
      const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined;

      const stats = await Booking.getBookingStats(startDate, endDate);
      
      // 處理統計數據
      const processedStats = {
        total: 0,
        pending: 0,
        confirmed: 0,
        cancelled: 0,
        completed: 0,
        no_show: 0,
        totalRevenue: 0
      };

      stats.forEach((stat: unknown) => {
        const statItem = stat as { _id: string; count: number; totalRevenue?: number };
        processedStats.total += statItem.count;
        
        // 檢查是否為有效的狀態鍵
        if (statItem._id === 'pending' || 
            statItem._id === 'confirmed' || 
            statItem._id === 'cancelled' || 
            statItem._id === 'completed' || 
            statItem._id === 'no_show') {
          processedStats[statItem._id] = statItem.count;
        }
        
        processedStats.totalRevenue += statItem.totalRevenue || 0;
      });

      return NextResponse.json({
        success: true,
        data: processedStats
      });
    }

    return NextResponse.json(
      { success: false, message: '無效的操作' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Booking stats error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: '獲取統計資料失敗',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { status: 500 }
    );
  }
}