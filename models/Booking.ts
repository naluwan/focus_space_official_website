import mongoose, { Document, Model } from 'mongoose';

// 預約狀態枚舉
export enum BookingStatus {
  PENDING = 'pending',      // 待確認
  CONFIRMED = 'confirmed',  // 已確認
  CANCELLED = 'cancelled',  // 已取消
  COMPLETED = 'completed',  // 已完成
  NO_SHOW = 'no_show'      // 未出席
}

// 預約類型枚舉
export enum BookingType {
  TRIAL = 'trial',        // 體驗
  COURSE = 'course'       // 課程
}

// 預約介面定義
export interface IBooking extends Document {
  // 預約類型
  bookingType: BookingType;
  
  // 客戶資訊
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNote?: string;
  
  // 體驗預約專屬資訊
  customerGender?: 'male' | 'female' | 'other';
  customerAge?: number;
  hasExperience?: boolean;
  fitnessGoals?: string;
  preferredDate?: string;
  preferredTime?: string;
  
  // 課程資訊（課程預約才需要）
  courseId?: mongoose.Types.ObjectId;
  courseName?: string;
  courseCategory?: 'personal' | 'group' | 'special';
  allowLateEnrollment?: boolean;
  courseRequirements?: string;
  courseFeatures?: string[];
  courseStartDate?: Date;
  courseEndDate?: Date;
  courseWeekdays?: number[];
  courseTimeSlots?: { startTime: string; endTime: string }[];
  
  // 預約時段（課程預約才需要）
  bookingDate?: Date;
  startTime?: string;
  endTime?: string;
  duration?: number;
  
  // 預約詳情
  participantCount: number;
  totalPrice: number;
  
  // 狀態管理
  status: BookingStatus;
  bookingNumber: string;
  
  // 管理資訊
  confirmedAt?: Date;
  confirmedBy?: string;
  cancelledAt?: Date;
  cancelledReason?: string;
  
  // 時間戳記
  createdAt: Date;
  updatedAt: Date;
  
  // 方法
  confirm(confirmedBy?: string): Promise<void>;
  cancel(reason?: string): Promise<void>;
}

// 預約 Schema
const BookingSchema = new mongoose.Schema<IBooking>(
  {
    // 預約類型
    bookingType: {
      type: String,
      enum: Object.values(BookingType),
      required: [true, '請選擇預約類型'],
      default: BookingType.TRIAL
    },
    
    // 客戶資訊
    customerName: {
      type: String,
      required: [true, '請提供客戶姓名'],
      trim: true,
      maxlength: [50, '姓名不能超過50個字元']
    },
    customerEmail: {
      type: String,
      required: [true, '請提供客戶電子郵件'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, '請提供有效的電子郵件']
    },
    customerPhone: {
      type: String,
      required: [true, '請提供客戶電話'],
      trim: true,
      match: [/^09\d{8}$/, '請提供有效的手機號碼']
    },
    customerNote: {
      type: String,
      maxlength: [500, '備註不能超過500個字元']
    },
    
    // 體驗預約專屬資訊
    customerGender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: false,
      default: undefined
    },
    customerAge: {
      type: Number,
      min: [10, '年齡最小為10歲'],
      max: [100, '年齡最大為100歲']
    },
    hasExperience: {
      type: Boolean
    },
    fitnessGoals: {
      type: String,
      maxlength: [500, '健身目標描述不能超過500個字元']
    },
    preferredDate: {
      type: String
    },
    preferredTime: {
      type: String
    },
    
    // 課程資訊（課程預約才需要）
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: function(this: IBooking) {
        return this.bookingType === BookingType.COURSE;
      }
    },
    courseName: {
      type: String,
      required: function(this: IBooking) {
        return this.bookingType === BookingType.COURSE;
      }
    },
    courseCategory: {
      type: String,
      enum: ['personal', 'group', 'special'],
      required: false,
      default: undefined
    },
    allowLateEnrollment: {
      type: Boolean,
      default: false
    },
    courseRequirements: {
      type: String,
      maxlength: [500, '課程要求不能超過500個字元']
    },
    courseFeatures: {
      type: [String],
      default: []
    },
    courseStartDate: {
      type: Date
    },
    courseEndDate: {
      type: Date
    },
    courseWeekdays: {
      type: [Number],
      default: []
    },
    courseTimeSlots: [{
      startTime: String,
      endTime: String
    }],
    
    // 預約時段（課程預約才需要）
    bookingDate: {
      type: Date,
      required: function(this: IBooking) {
        return this.bookingType === BookingType.COURSE;
      },
      validate: {
        validator: function(date: Date) {
          if (!date) return true;
          
          // 如果允許插班，則放寬日期限制
          if (this.allowLateEnrollment === true) {
            return true;
          }
          
          // 對於團體課程，也放寬限制（因為可能是課程固定日期）
          if (this.courseCategory === 'group' || this.courseCategory === 'special') {
            return true;
          }
          
          // 對於個人課程，需要驗證是今天或未來日期
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const bookingDate = new Date(date);
          bookingDate.setHours(0, 0, 0, 0);
          return bookingDate >= today;
        },
        message: '預約日期不能是過去的日期'
      }
    },
    startTime: {
      type: String,
      required: function(this: IBooking) {
        return this.bookingType === BookingType.COURSE;
      }
    },
    endTime: {
      type: String,
      required: function(this: IBooking) {
        return this.bookingType === BookingType.COURSE;
      }
    },
    duration: {
      type: Number,
      min: [30, '課程時間至少30分鐘']
    },
    
    // 預約詳情
    participantCount: {
      type: Number,
      default: 1,
      min: [1, '參與人數至少1人']
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, '價格不能為負數']
    },
    
    // 狀態管理
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING
    },
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    
    // 管理資訊
    confirmedAt: Date,
    confirmedBy: String,
    cancelledAt: Date,
    cancelledReason: String
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// 索引設定
BookingSchema.index({ customerEmail: 1 });
BookingSchema.index({ courseId: 1, bookingDate: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ createdAt: -1 });

// 靜態方法
BookingSchema.statics = {
  // 產生唯一預約編號
  async generateBookingNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // 查找今天的預約數量
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    const count = await this.countDocuments({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });
    
    const sequence = String(count + 1).padStart(4, '0');
    return `FS${year}${month}${day}${sequence}`;
  },
  
  // 檢查時段衝突
  async checkTimeConflict(
    courseId: string,
    bookingDate: Date,
    startTime: string,
    endTime: string,
    excludeBookingId?: string
  ): Promise<boolean> {
    const query: Record<string, unknown> = {
      courseId,
      bookingDate: {
        $gte: new Date(bookingDate.setHours(0, 0, 0, 0)),
        $lte: new Date(bookingDate.setHours(23, 59, 59, 999))
      },
      status: { $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
      $or: [
        // 新預約的開始時間在現有預約時段內
        { startTime: { $lte: startTime }, endTime: { $gt: startTime } },
        // 新預約的結束時間在現有預約時段內
        { startTime: { $lt: endTime }, endTime: { $gte: endTime } },
        // 新預約完全包含現有預約
        { startTime: { $gte: startTime }, endTime: { $lte: endTime } }
      ]
    };
    
    if (excludeBookingId) {
      query._id = { $ne: excludeBookingId };
    }
    
    const conflictingBooking = await this.findOne(query);
    return !!conflictingBooking;
  },
  
  // 查找可用時段
  async findAvailableSlots(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _courseId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _date: Date
  ): Promise<Array<{ startTime: string; endTime: string; available: boolean }>> {
    // 這裡可以根據課程的營業時間和已預約時段計算可用時段
    // 暫時返回示例資料
    return [];
  },
  
  // 獲取預約統計
  async getBookingStats(startDate?: Date, endDate?: Date) {
    const match: Record<string, unknown> = {};
    
    if (startDate && endDate) {
      match.createdAt = {
        $gte: startDate,
        $lte: endDate
      };
    }
    
    return this.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ]);
  }
};

// 實例方法
BookingSchema.methods = {
  // 確認預約
  async confirm(confirmedBy?: string): Promise<void> {
    this.status = BookingStatus.CONFIRMED;
    this.confirmedAt = new Date();
    if (confirmedBy) {
      this.confirmedBy = confirmedBy;
    }
    await this.save();
  },
  
  // 取消預約
  async cancel(reason?: string): Promise<void> {
    this.status = BookingStatus.CANCELLED;
    this.cancelledAt = new Date();
    if (reason) {
      this.cancelledReason = reason;
    }
    await this.save();
  },
  
  // 標記為完成
  async complete(): Promise<void> {
    this.status = BookingStatus.COMPLETED;
    await this.save();
  },
  
  // 標記為未出席
  async markNoShow(): Promise<void> {
    this.status = BookingStatus.NO_SHOW;
    await this.save();
  }
};

// 擴展介面以包含靜態方法
interface IBookingModel extends Model<IBooking> {
  generateBookingNumber(): Promise<string>;
  checkTimeConflict(
    courseId: string,
    bookingDate: Date,
    startTime: string,
    endTime: string,
    excludeBookingId?: string
  ): Promise<boolean>;
  findAvailableSlots(
    courseId: string,
    date: Date
  ): Promise<Array<{ startTime: string; endTime: string; available: boolean }>>;
  getBookingStats(startDate?: Date, endDate?: Date): Promise<unknown[]>;
}

// 建立或獲取模型
const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

// 為 Booking 添加靜態方法類型定義
interface BookingStatics {
  generateBookingNumber(): Promise<string>;
  checkTimeConflict(
    courseId: string,
    bookingDate: Date,
    startTime: string,
    endTime: string,
    excludeBookingId?: string
  ): Promise<boolean>;
  findAvailableSlots(
    courseId: string,
    date: Date
  ): Promise<Array<{ startTime: string; endTime: string; available: boolean }>>;
  getBookingStats(startDate?: Date, endDate?: Date): Promise<unknown[]>;
}

const BookingModel = Booking as typeof Booking & BookingStatics;

export default BookingModel;