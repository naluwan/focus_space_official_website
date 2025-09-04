import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Testimonial from '@/models/TestimonialMongoose';
import { handleApiError } from '@/lib/api-types';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
      return NextResponse.json({ error: '未授權訪問' }, { status: 401 });
    }

    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const published = searchParams.get('published');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc';

    const skip = (page - 1) * limit;

    // 建立查詢條件
    const query: { 
      isPublished?: boolean;
      $or?: Array<{
        memberName?: { $regex: string; $options: string };
        content?: { $regex: string; $options: string };
        occupation?: { $regex: string; $options: string };
        tags?: { $in: RegExp[] };
      }>;
    } = {};
    
    if (published !== null) {
      query.isPublished = published === 'true';
    }
    
    if (search) {
      query.$or = [
        { memberName: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { occupation: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // 建立排序
    const sort: { [key: string]: 1 | -1 } = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    if (sortBy !== 'createdAt') {
      sort.createdAt = -1; // 預設按建立時間排序
    }

    // 獲取見證和總數
    const [testimonials, total] = await Promise.all([
      Testimonial.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Testimonial.countDocuments(query)
    ]);

    return NextResponse.json({
      testimonials,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('獲取見證列表失敗:', error);
    return NextResponse.json({ error: '獲取見證列表失敗' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
      return NextResponse.json({ error: '未授權訪問' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();

    // 建立新見證
    const testimonial = new Testimonial({
      memberName: body.memberName,
      age: body.age,
      occupation: body.occupation,
      content: body.content,
      rating: body.rating,
      imageUrl: body.imageUrl,
      beforeImageUrl: body.beforeImageUrl,
      afterImageUrl: body.afterImageUrl,
      isPublished: body.isPublished || false,
      tags: body.tags || [],
      trainingPeriod: body.trainingPeriod,
      achievements: body.achievements || [],
      sortOrder: body.sortOrder || 0
    });

    await testimonial.save();

    return NextResponse.json({ testimonial }, { status: 201 });

  } catch (error: unknown) {
    const { message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}