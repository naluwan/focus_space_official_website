import mongoose, { Document, Model } from 'mongoose';

// 課程類型枚舉
export enum CourseCategory {
  PERSONAL = 'personal', // 個人課程
  GROUP = 'group', // 團體課程
  SPECIAL = 'special', // 特殊課程
}

// 難度等級枚舉
export enum CourseDifficulty {
  BEGINNER = 'beginner', // 初級
  INTERMEDIATE = 'intermediate', // 中級
  ADVANCED = 'advanced', // 高級
}

// 課程介面定義
export interface ICourse extends Document {
  title: string;
  description: string;
  category: CourseCategory;
  difficulty: CourseDifficulty;
  duration: number; // 每堂課分鐘數
  price: number;
  maxParticipants?: number; // 團體課程專用，個人課程為 1
  instructor?: string;
  imageUrl?: string;
  features: string[]; // 課程特色
  requirements?: string; // 上課要求/注意事項

  // 課程時間設定
  startDate: Date; // 課程開始日期
  endDate: Date; // 課程結束日期
  weekdays: number[]; // 每週上課星期幾 (0=星期日, 1=星期一, ..., 6=星期六)
  timeSlots: {
    startTime: string; // 上課時間 (格式: "HH:mm", 例如: "09:00")
    endTime: string; // 下課時間 (格式: "HH:mm", 例如: "10:30")
  }[];

  // 插班設定
  allowLateEnrollment: boolean; // 是否允許課程開始後插班

  isActive: boolean;
  displayOrder: number; // 顯示順序
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // 管理員 ID
  updatedBy: string; // 最後更新者 ID
}

// 課程 Schema
const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, '課程名稱為必填'],
      trim: true,
      maxlength: [100, '課程名稱不能超過100個字元'],
    },
    description: {
      type: String,
      required: [true, '課程描述為必填'],
      maxlength: [2000, '課程描述不能超過2000個字元'],
    },
    category: {
      type: String,
      enum: Object.values(CourseCategory),
      required: [true, '請選擇課程類型'],
      default: CourseCategory.PERSONAL,
    },
    difficulty: {
      type: String,
      enum: Object.values(CourseDifficulty),
      required: [true, '請選擇難度等級'],
      default: CourseDifficulty.BEGINNER,
    },
    duration: {
      type: Number,
      required: [true, '請設定課程時長'],
      min: [15, '課程時長至少15分鐘'],
      max: [480, '課程時長最多8小時'],
    },
    price: {
      type: Number,
      required: [true, '請設定課程價格'],
      min: [0, '價格不能為負數'],
    },
    maxParticipants: {
      type: Number,
      min: [1, '參與人數至少1人'],
      max: [50, '參與人數最多50人'],
      default: function (this: ICourse) {
        return this.category === CourseCategory.PERSONAL ? 1 : 10;
      },
    },
    instructor: {
      type: String,
      trim: true,
      maxlength: [50, '教練名稱不能超過50個字元'],
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    requirements: {
      type: String,
      maxlength: [1000, '上課要求不能超過1000個字元'],
    },

    // 課程時間設定
    startDate: {
      type: Date,
      required: [true, '請設定課程開始日期'],
    },
    endDate: {
      type: Date,
      required: [true, '請設定課程結束日期'],
    },
    weekdays: {
      type: [Number],
      required: [true, '請選擇上課星期'],
      validate: {
        validator: function (weekdays: number[]) {
          return weekdays.length > 0 && weekdays.every((day) => day >= 0 && day <= 6);
        },
        message: '請選擇有效的上課星期（0-6）',
      },
    },
    timeSlots: {
      type: [
        {
          startTime: {
            type: String,
            required: true,
            match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, '請使用正確的時間格式 (HH:mm)'],
          },
          endTime: {
            type: String,
            required: true,
            match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, '請使用正確的時間格式 (HH:mm)'],
          },
        },
      ],
      required: [true, '請設定上課時間'],
      validate: {
        validator: function (timeSlots: { startTime: string; endTime: string }[]) {
          if (timeSlots.length === 0) return false;

          return timeSlots.every((slot) => {
            const start = slot.startTime.split(':').map(Number);
            const end = slot.endTime.split(':').map(Number);
            const startMinutes = start[0] * 60 + start[1];
            const endMinutes = end[0] * 60 + end[1];
            return endMinutes > startMinutes;
          });
        },
        message: '結束時間必須晚於開始時間',
      },
    },

    // 插班設定
    allowLateEnrollment: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: String,
      required: [true, '請提供建立者資訊'],
    },
    updatedBy: {
      type: String,
      required: [true, '請提供更新者資訊'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// 索引設定
CourseSchema.index({ category: 1, isActive: 1 });
CourseSchema.index({ startDate: 1, endDate: 1 });
CourseSchema.index({ displayOrder: 1 });
CourseSchema.index({ createdAt: -1 });

// 靜態方法
CourseSchema.statics = {
  // 獲取活躍課程
  async getActiveCourses(category?: CourseCategory) {
    const query: Record<string, unknown> = { isActive: true };
    if (category) {
      query.category = category;
    }
    return this.find(query).sort({ displayOrder: 1, createdAt: -1 });
  },

  // 獲取可預約課程
  async getBookableCourses() {
    const today = new Date();
    return this.find({
      isActive: true,
      $or: [
        // 個人課程總是可預約
        { category: CourseCategory.PERSONAL },
        // 團體課程：未開始或允許插班
        {
          category: { $in: [CourseCategory.GROUP, CourseCategory.SPECIAL] },
          $or: [
            { startDate: { $gt: today } },
            { allowLateEnrollment: true, endDate: { $gt: today } },
          ],
        },
      ],
    }).sort({ displayOrder: 1, startDate: 1 });
  },

  // 課程統計
  async getCourseStats() {
    return this.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          activeCount: {
            $sum: { $cond: ['$isActive', 1, 0] },
          },
          avgPrice: { $avg: '$price' },
        },
      },
    ]);
  },
};

// 實例方法
CourseSchema.methods = {
  // 檢查是否可預約
  isBookable(): boolean {
    if (!this.isActive) return false;

    const today = new Date();

    // 個人課程總是可預約
    if (this.category === CourseCategory.PERSONAL) {
      return true;
    }

    // 團體課程檢查
    if (this.startDate > today) {
      return true; // 尚未開始
    }

    if (this.endDate > today && this.allowLateEnrollment) {
      return true; // 進行中但允許插班
    }

    return false;
  },

  // 獲取上課時間文字描述
  getScheduleDescription(): string {
    const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
    const weekdayText = this.weekdays.map((day: number) => `星期${dayNames[day]}`).join('、');
    const timeText = this.timeSlots
      .map((slot: { startTime: string; endTime: string }) => `${slot.startTime}-${slot.endTime}`)
      .join('、');
    return `${weekdayText} ${timeText}`;
  },
};

// 建立或獲取模型
let Course: Model<ICourse>;

try {
  Course = mongoose.model<ICourse>('Course');
} catch {
  Course = mongoose.model<ICourse>('Course', CourseSchema);
}

export default Course;
