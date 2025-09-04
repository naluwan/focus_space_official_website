import { NextResponse } from 'next/server';
import Testimonial, { ITestimonial } from '@/models/TestimonialMongoose';
import { connectToDatabase } from '@/lib/mongodb';

// 將數據庫格式轉換為前端期望的格式
function transformTestimonialData(testimonial: ITestimonial) {
  return {
    _id: testimonial._id?.toString(),
    memberName: testimonial.memberName,
    age: testimonial.age,
    occupation: testimonial.occupation,
    content: testimonial.content,
    rating: testimonial.rating,
    tags: testimonial.tags || [],
    achievements: testimonial.achievements || [],
    trainingPeriod: testimonial.trainingPeriod,
    imageUrl: testimonial.imageUrl,
    beforeImageUrl: testimonial.beforeImageUrl,
    afterImageUrl: testimonial.afterImageUrl,
    isPublished: testimonial.isPublished,
    sortOrder: testimonial.sortOrder,
    createdAt: testimonial.createdAt.toISOString(),
    updatedAt: testimonial.updatedAt.toISOString(),
    publishedAt: testimonial.publishedAt?.toISOString()
  };
}

export async function GET(request: Request) {
  try {
    // 確保 MongoDB 連接
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const featured = searchParams.get('featured') === 'true';
    const category = searchParams.get('category');
    const rating = parseFloat(searchParams.get('rating') || '0');
    const search = searchParams.get('search') || '';

    let testimonials: ITestimonial[] = [];

    // 如果有搜尋條件，使用搜尋功能
    if (search.trim()) {
      testimonials = await Testimonial.find({
        isPublished: true,
        $or: [
          { memberName: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { occupation: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ]
      }).limit(featured ? 3 : limit).sort({ sortOrder: -1, publishedAt: -1 });
    } else {
      // 否則使用一般查詢
      testimonials = await Testimonial.find({ isPublished: true })
        .limit(featured ? 3 : limit)
        .sort({ sortOrder: -1, publishedAt: -1 });
    }

    // 前端篩選（評分和分類）
    let filteredTestimonials = testimonials;

    // 評分篩選
    if (rating > 0) {
      filteredTestimonials = filteredTestimonials.filter(t => t.rating >= rating);
    }

    // 分類篩選（與前端統一的智能分類邏輯）
    if (category && category !== 'all') {
      filteredTestimonials = filteredTestimonials.filter(testimonial => {
        const tags = testimonial.tags ? testimonial.tags.map(tag => tag.toLowerCase().trim()) : [];
        const content = testimonial.content ? testimonial.content.toLowerCase() : '';
        const achievements = testimonial.achievements ? testimonial.achievements.map(a => a.toLowerCase()).join(' ') : '';
        
        // 檢查所有文字內容
        const allText = [...tags, content, achievements].join(' ');
        
        switch (category) {
          case 'weight-loss':
            const weightLossKeywords = ['減重', '減脂', '瘦身', '減肥', '體重', '脂肪', '瘦'];
            return weightLossKeywords.some(keyword => allText.includes(keyword));
          case 'muscle-gain':
            const muscleGainKeywords = ['增肌', '塑形', '肌肉', '線條', '體態', '身材'];
            return muscleGainKeywords.some(keyword => allText.includes(keyword));
          case 'health':
            const healthKeywords = ['健康', '復健', '疼痛', '改善', '治療', '康復'];
            return healthKeywords.some(keyword => allText.includes(keyword));
          case 'fitness':
            const fitnessKeywords = ['體能', '耐力', '運動', '訓練', '體力'];
            return fitnessKeywords.some(keyword => allText.includes(keyword));
          default:
            return true;
        }
      });
    }

    // 轉換數據格式
    const transformedTestimonials = filteredTestimonials.map(transformTestimonialData);

    return NextResponse.json({
      success: true,
      data: transformedTestimonials,
      total: transformedTestimonials.length
    });
  } catch (error) {
    console.error('[Testimonials API] Error fetching testimonials:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch testimonials'
    }, { status: 500 });
  }
}