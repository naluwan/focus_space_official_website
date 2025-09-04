import mongoose, { Document, Model } from 'mongoose';

// 見證介面定義
export interface ITestimonial extends Document {
  memberName: string;
  age?: number;
  occupation?: string;
  content: string;
  rating: number; // 1-5 stars
  imageUrl?: string;
  beforeImageUrl?: string; // 前照片
  afterImageUrl?: string; // 後照片
  isPublished: boolean;
  tags: string[]; // 例如: ['減重', '增肌', '體態改善']
  trainingPeriod?: string; // 訓練期間，例如: '3個月'
  achievements?: string[]; // 成就，例如: ['減重10公斤', '體脂降低5%']
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  sortOrder: number; // 用於前台顯示順序
}

// 見證 Schema
const TestimonialSchema = new mongoose.Schema<ITestimonial>(
  {
    memberName: {
      type: String,
      required: [true, '會員姓名為必填'],
      trim: true,
      maxlength: [50, '姓名不能超過50個字元']
    },
    age: {
      type: Number,
      min: [10, '年齡最小為10歲'],
      max: [100, '年齡最大為100歲']
    },
    occupation: {
      type: String,
      trim: true,
      maxlength: [100, '職業不能超過100個字元']
    },
    content: {
      type: String,
      required: [true, '見證內容為必填'],
      trim: true,
      minlength: [10, '見證內容至少需要10個字元'],
      maxlength: [2000, '見證內容不能超過2000個字元']
    },
    rating: {
      type: Number,
      required: [true, '請提供評分'],
      min: [1, '評分最低為1分'],
      max: [5, '評分最高為5分'],
      validate: {
        validator: function(rating: number) {
          // 修復浮點數精度問題，將數字乘以10後檢查是否為整數
          return Number.isInteger(Math.round(rating * 10));
        },
        message: '評分必須是0.1的倍數（例如：1.0, 2.5, 4.8）'
      }
    },
    imageUrl: {
      type: String,
      trim: true
    },
    beforeImageUrl: {
      type: String,
      trim: true
    },
    afterImageUrl: {
      type: String,
      trim: true
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function(tags: string[]) {
          return tags.length <= 10; // 最多10個標籤
        },
        message: '標籤數量不能超過10個'
      }
    },
    trainingPeriod: {
      type: String,
      trim: true,
      maxlength: [50, '訓練期間描述不能超過50個字元']
    },
    achievements: {
      type: [String],
      default: [],
      validate: {
        validator: function(achievements: string[]) {
          return achievements.length <= 20; // 最多20個成就
        },
        message: '成就數量不能超過20個'
      }
    },
    publishedAt: {
      type: Date,
      default: undefined
    },
    sortOrder: {
      type: Number,
      default: 0,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// 索引設定
TestimonialSchema.index({ isPublished: 1, sortOrder: 1 });
TestimonialSchema.index({ createdAt: -1 });
TestimonialSchema.index({ rating: -1 });
TestimonialSchema.index({ tags: 1 });

// 中間件：發佈時設定 publishedAt
TestimonialSchema.pre('save', function(next) {
  if (this.isModified('isPublished')) {
    if (this.isPublished && !this.publishedAt) {
      this.publishedAt = new Date();
    } else if (!this.isPublished) {
      this.publishedAt = undefined;
    }
  }
  next();
});

// 靜態方法
TestimonialSchema.statics = {
  // 獲取已發佈的見證
  async getPublished(limit?: number) {
    let query = this.find({ isPublished: true });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return query.sort({ sortOrder: -1, publishedAt: -1 });
  },
  
  // 獲取熱門見證（高評分）
  async getTopRated(limit = 10) {
    return this.find({ 
      isPublished: true, 
      rating: { $gte: 4 } 
    })
    .sort({ rating: -1, sortOrder: -1 })
    .limit(limit);
  },
  
  // 根據標籤搜尋
  async getByTags(tags: string[], limit = 20) {
    return this.find({
      isPublished: true,
      tags: { $in: tags }
    })
    .sort({ sortOrder: -1, publishedAt: -1 })
    .limit(limit);
  },
  
  // 見證統計
  async getTestimonialStats() {
    return this.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          published: {
            $sum: { $cond: ['$isPublished', 1, 0] }
          },
          avgRating: { $avg: '$rating' },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          published: 1,
          avgRating: { $round: ['$avgRating', 2] },
          ratingDistribution: 1
        }
      }
    ]);
  },
  
  // 更新排序
  async updateSortOrder(testimonialId: string, newOrder: number) {
    return this.findByIdAndUpdate(
      testimonialId, 
      { sortOrder: newOrder },
      { new: true }
    );
  }
};

// 實例方法
TestimonialSchema.methods = {
  // 發佈見證
  async publish(): Promise<void> {
    this.isPublished = true;
    this.publishedAt = new Date();
    await this.save();
  },
  
  // 取消發佈
  async unpublish(): Promise<void> {
    this.isPublished = false;
    this.publishedAt = undefined;
    await this.save();
  },
  
  // 獲取星級顯示
  getStarDisplay(): string {
    const fullStars = '★'.repeat(this.rating);
    const emptyStars = '☆'.repeat(5 - this.rating);
    return fullStars + emptyStars;
  },
  
  // 獲取簡短內容（用於列表顯示）
  getShortContent(maxLength = 100): string {
    if (this.content.length <= maxLength) {
      return this.content;
    }
    return this.content.substring(0, maxLength) + '...';
  },
  
  // 檢查是否有前後對比照
  hasBeforeAfterPhotos(): boolean {
    return !!(this.beforeImageUrl && this.afterImageUrl);
  }
};

// 虛擬屬性：獲取標籤字串
TestimonialSchema.virtual('tagsString').get(function() {
  return this.tags.join(', ');
});

// 虛擬屬性：獲取成就字串
TestimonialSchema.virtual('achievementsString').get(function() {
  return this.achievements?.join(', ') || '';
});

// 確保虛擬屬性在 JSON 轉換時包含
TestimonialSchema.set('toJSON', { virtuals: true });
TestimonialSchema.set('toObject', { virtuals: true });

// 建立或獲取模型
let Testimonial: Model<ITestimonial>;

try {
  Testimonial = mongoose.model<ITestimonial>('Testimonial');
} catch {
  Testimonial = mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
}

export default Testimonial;