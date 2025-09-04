import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Course, { CourseCategory, CourseDifficulty } from '@/models/CourseMongoose';

// GET - 獲取所有課程
export async function GET(request: Request) {
  try {
    // 驗證管理員權限
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as CourseCategory | null;
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'displayOrder';
    const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // 建立查詢條件
    const query: { 
      category?: CourseCategory;
      isActive?: boolean;
      $or?: Array<{
        title?: { $regex: string; $options: string };
        description?: { $regex: string; $options: string };
        instructor?: { $regex: string; $options: string };
      }>;
    } = {};
    
    if (category) {
      query.category = category;
    }
    
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { instructor: { $regex: search, $options: 'i' } }
      ];
    }

    // 建立排序
    const sort: { [key: string]: 1 | -1 } = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    if (sortBy !== 'createdAt') {
      sort.createdAt = -1; // 預設按建立時間排序
    }

    // 獲取課程和總數
    const [courses, total] = await Promise.all([
      Course.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Course.countDocuments(query)
    ]);

    // 獲取統計資料
    // const stats = await Course.getCourseStats();

    return NextResponse.json({
      success: true,
      data: {
        courses,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        // stats,
      },
    });
  } catch (error: unknown) {
    console.error('[Courses API] Error fetching courses:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST - 創建新課程
export async function POST(request: Request) {
  try {
    // 驗證管理員權限
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();

    // 準備課程資料
    const courseData = {
      title: body.title,
      description: body.description,
      category: body.category as CourseCategory,
      difficulty: body.difficulty as CourseDifficulty,
      duration: Number(body.duration),
      price: Number(body.price),
      maxParticipants: body.category === 'personal' ? 1 : Number(body.maxParticipants || 10),
      instructor: body.instructor || '',
      imageUrl: body.imageUrl || '',
      features: Array.isArray(body.features) ? body.features : [],
      requirements: body.requirements || '',
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      weekdays: (() => {
        // 處理 weekdays 轉換：字串陣列轉為數字陣列
        const weekdayMap: { [key: string]: number } = {
          'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
          'thursday': 4, 'friday': 5, 'saturday': 6
        };
        const weekdays = body.weekdays || [];
        if (Array.isArray(weekdays)) {
          return weekdays
            .map((day: string | number) => 
              typeof day === 'string' ? weekdayMap[day] : day
            )
            .filter((day: string | number): day is number => 
              typeof day === 'number' && day >= 0 && day <= 6
            );
        }
        return [];
      })(),
      timeSlots: body.timeSlots || [],
      allowLateEnrollment: body.allowLateEnrollment === true,
      isActive: body.isActive !== false,
      displayOrder: Number(body.displayOrder || 0),
      createdBy: session.user.id,
      updatedBy: session.user.id,
    };

    // 使用 Mongoose 創建課程
    const newCourse = new Course(courseData);
    await newCourse.save();

    return NextResponse.json({
      success: true,
      data: newCourse,
      message: '課程創建成功',
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('[Courses API] Error creating course:', error);
    
    // 處理Mongoose驗證錯誤
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({ error: '課程資料驗證失敗' }, { status: 400 });
    }
    
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}