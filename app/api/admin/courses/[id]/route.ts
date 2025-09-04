import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Course, { ICourse, CourseCategory, CourseDifficulty } from '@/models/CourseMongoose';

// GET - 獲取單一課程
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 驗證管理員權限
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectToDatabase();
    const course = await Course.findById(params.id).lean();

    if (!course) {
      return NextResponse.json({
        success: false,
        error: 'Course not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: course,
    });
  } catch (error: unknown) {
    console.error('[Course API] Error fetching course:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PUT - 更新課程
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 驗證管理員權限
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();

    // 檢查課程是否存在
    const existingCourse = await Course.findById(params.id);
    if (!existingCourse) {
      return NextResponse.json({
        success: false,
        error: 'Course not found',
      }, { status: 404 });
    }

    // 準備更新資料
    const updateData: Partial<ICourse> = {
      updatedBy: session.user.id,
    };

    // 只更新提供的欄位
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.category !== undefined) updateData.category = body.category as CourseCategory;
    if (body.difficulty !== undefined) updateData.difficulty = body.difficulty as CourseDifficulty;
    if (body.duration !== undefined) updateData.duration = Number(body.duration);
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.maxParticipants !== undefined) updateData.maxParticipants = Number(body.maxParticipants);
    if (body.instructor !== undefined) updateData.instructor = body.instructor;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.features !== undefined) updateData.features = Array.isArray(body.features) ? body.features : [];
    if (body.requirements !== undefined) updateData.requirements = body.requirements;
    
    // 處理日期時確保正確的時區和格式
    if (body.startDate !== undefined) {
      const startDate = new Date(body.startDate);
      // 設置為當天的開始時間
      startDate.setHours(0, 0, 0, 0);
      updateData.startDate = startDate;
    }
    if (body.endDate !== undefined) {
      const endDate = new Date(body.endDate);
      // 設置為當天的結束時間
      endDate.setHours(23, 59, 59, 999);
      updateData.endDate = endDate;
    }
    
    // 驗證日期邏輯
    // 如果同時更新兩個日期，直接驗證
    if (updateData.startDate && updateData.endDate) {
      if (updateData.endDate < updateData.startDate) {
        return NextResponse.json({
          success: false,
          error: '結束日期必須晚於或等於開始日期'
        }, { status: 400 });
      }
    }
    // 如果只更新結束日期，與現有的開始日期比較
    else if (updateData.endDate && !updateData.startDate) {
      if (updateData.endDate < existingCourse.startDate) {
        return NextResponse.json({
          success: false,
          error: '結束日期必須晚於或等於開始日期'
        }, { status: 400 });
      }
    }
    // 如果只更新開始日期，與現有的結束日期比較
    else if (updateData.startDate && !updateData.endDate) {
      if (updateData.startDate > existingCourse.endDate) {
        return NextResponse.json({
          success: false,
          error: '開始日期必須早於或等於結束日期'
        }, { status: 400 });
      }
    }
    if (body.weekdays !== undefined) {
      // 處理 weekdays 轉換：字串陣列轉為數字陣列
      const weekdayMap: { [key: string]: number } = {
        'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
        'thursday': 4, 'friday': 5, 'saturday': 6
      };
      if (Array.isArray(body.weekdays)) {
        updateData.weekdays = body.weekdays
          .map((day: string | number) => 
            typeof day === 'string' ? weekdayMap[day] : day
          )
          .filter((day: string | number): day is number => 
            typeof day === 'number' && day >= 0 && day <= 6
          );
      } else {
        updateData.weekdays = body.weekdays;
      }
    }
    if (body.timeSlots !== undefined) updateData.timeSlots = body.timeSlots;
    if (body.allowLateEnrollment !== undefined) updateData.allowLateEnrollment = body.allowLateEnrollment;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.displayOrder !== undefined) updateData.displayOrder = Number(body.displayOrder);

    const updatedCourse = await Course.findByIdAndUpdate(
      params.id, 
      updateData,
      { new: true, runValidators: false } // 關閉自動驗證，因為我們已經手動驗證了
    );

    if (!updatedCourse) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update course',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: updatedCourse,
      message: '課程更新成功',
    });
  } catch (error: unknown) {
    console.error('[Course API] Error updating course:', error);
    
    // 處理 Mongoose 驗證錯誤
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
      const mongooseError = error as unknown as { errors: Record<string, { message: string }> };
      const validationErrors = Object.keys(mongooseError.errors).map(key => ({
        field: key,
        message: mongooseError.errors[key].message
      }));
      
      return NextResponse.json({
        success: false,
        error: '資料驗證失敗',
        validationErrors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal Server Error'
    }, { status: 500 });
  }
}

// DELETE - 刪除課程
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 驗證管理員權限
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectToDatabase();

    // 檢查課程是否存在
    const course = await Course.findById(params.id);
    if (!course) {
      return NextResponse.json({
        success: false,
        error: 'Course not found',
      }, { status: 404 });
    }

    // 軟刪除：設置為不活躍
    const deletedCourse = await Course.findByIdAndUpdate(
      params.id,
      { 
        isActive: false,
        updatedBy: session.user.id 
      },
      { new: true }
    );

    if (!deletedCourse) {
      return NextResponse.json({
        success: false,
        error: 'Failed to delete course',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: '課程已停用',
    });
  } catch (error: unknown) {
    console.error('[Course API] Error deleting course:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}