import * as nodemailer from 'nodemailer';

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface BookingEmailData {
  bookingType: 'trial' | 'course';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
  bookingNumber?: string;
  customerNote?: string;

  // 課程相關欄位
  courseName?: string;
  courseCategory?: 'personal' | 'group' | 'special';
  duration?: number;
  totalPrice?: number;
  participantCount?: number;
  courseStartDate?: string;
  courseEndDate?: string;
  courseWeekdays?: number[];
  courseTimeSlots?: TimeSlot[];
  bookingDate?: string;
  startTime?: string;
  endTime?: string;
  courseRequirements?: string;
  courseFeatures?: string[];

  // 體驗預約相關欄位
  customerGender?: 'male' | 'female' | 'other';
  customerAge?: number;
  hasExperience?: boolean;
  fitnessGoals?: string;
  preferredDate?: string;
  preferredTime?: string;
}

// 創建郵件傳送器
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('Email credentials not configured');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// 發送預約確認郵件
export const sendBookingEmail = async (bookingData: BookingEmailData) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log('Email service not configured, skipping email sending');
    return;
  }

  const { bookingType, customerName, customerEmail, customerPhone, createdAt } =
    bookingData;

  // 根據預約類型設定郵件內容
  const isTrialBooking = bookingType === 'trial';
  const subject = isTrialBooking
    ? 'Focus Space 場館體驗預約確認'
    : 'Focus Space 課程預約確認';

  const htmlContent = `
    <div style="font-family: 'Microsoft YaHei', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
      <!-- Header with logo and gym name -->
      <div style="background: linear-gradient(135deg, #e53e3e, #c53030); color: white; padding: 30px 20px; text-align: center;">
        <img src="https://your-domain.com/logo2.png" alt="Focus Space Logo" style="width: 120px; height: auto; margin: 0 auto 15px auto; display: block;" />
        <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Focus Space 專心練運動空間</h1>
        <h2 style="margin: 10px 0 0 0; font-size: 18px; font-weight: normal; opacity: 0.9;">預約確認通知</h2>
      </div>
      
      <!-- Booking Information -->
      <div style="padding: 30px 20px;">
        <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #e53e3e;">
          <h3 style="margin: 0 0 15px 0; color: #2d3748; font-size: 18px;">📋 預約資訊</h3>
          <div style="line-height: 1.8; color: #4a5568;">
            <p style="margin: 8px 0;"><strong>預約類型：</strong>${
              isTrialBooking ? '場館體驗' : '課程預約'
            }</p>
            <p style="margin: 8px 0;"><strong>客戶姓名：</strong>${customerName}</p>
            <p style="margin: 8px 0;"><strong>聯絡電話：</strong>${customerPhone}</p>
            <p style="margin: 8px 0;"><strong>電子郵件：</strong>${customerEmail}</p>
            <p style="margin: 8px 0;"><strong>預約時間：</strong>${new Date(
              createdAt,
            ).toLocaleString('zh-TW')}</p>
            ${
              bookingData.bookingNumber
                ? `<p style="margin: 8px 0;"><strong>預約編號：</strong>${bookingData.bookingNumber}</p>`
                : ''
            }
          </div>
        </div>

        ${
          isTrialBooking
            ? `
          <!-- Trial Experience Details -->
          <div style="background: linear-gradient(135deg, #f0fff4, #e6fffa); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #48bb78;">
            <h4 style="margin: 0 0 15px 0; color: #22543d; font-size: 16px;">🎯 場館體驗說明</h4>
            <ul style="color: #276749; line-height: 1.6; padding-left: 20px; margin: 0;">
              <li>體驗時間約 60 分鐘，包含完整場館導覽</li>
              <li>專業設備介紹與使用說明</li>
              <li>一對一教練諮詢與健身計劃建議</li>
              <li>免費體驗，無任何隱藏費用</li>
              <li>可現場了解課程方案與會員優惠</li>
            </ul>
          </div>
        `
            : `
          <!-- Course Booking Details -->
          <div style="background: linear-gradient(135deg, #fff5f5, #fed7d7); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #e53e3e;">
            <h4 style="margin: 0 0 15px 0; color: #742a2a; font-size: 16px;">🏋️ 課程預約詳情</h4>
            ${
              bookingData.courseName
                ? `
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 15px 0;">
                <h5 style="margin: 0 0 15px 0; color: #742a2a; font-size: 16px;">📚 課程資訊</h5>
                <div style="line-height: 1.8; color: #4a5568;">
                  <p style="margin: 8px 0;"><strong>課程名稱：</strong>${
                    bookingData.courseName
                  }</p>
                  ${
                    bookingData.courseCategory
                      ? `<p style="margin: 8px 0;"><strong>課程類型：</strong>${
                          bookingData.courseCategory === 'personal'
                            ? '個人課程'
                            : bookingData.courseCategory === 'group'
                            ? '團體課程'
                            : '特殊課程'
                        }</p>`
                      : ''
                  }
                  ${
                    bookingData.duration
                      ? `<p style="margin: 8px 0;"><strong>課程時長：</strong>${bookingData.duration}分鐘</p>`
                      : ''
                  }
                  ${
                    bookingData.totalPrice
                      ? `<p style="margin: 8px 0;"><strong>課程費用：</strong>NT$ ${bookingData.totalPrice}</p>`
                      : ''
                  }
                  ${
                    bookingData.participantCount
                      ? `<p style="margin: 8px 0;"><strong>參與人數：</strong>${bookingData.participantCount}人</p>`
                      : ''
                  }
                </div>
                
                ${
                  bookingData.courseStartDate && bookingData.courseEndDate
                    ? `
                  <h5 style="margin: 15px 0 10px 0; color: #742a2a; font-size: 16px;">📅 課程時程</h5>
                  <div style="line-height: 1.8; color: #4a5568;">
                    <p style="margin: 8px 0;"><strong>課程期間：</strong>${new Date(
                      bookingData.courseStartDate,
                    ).toLocaleDateString('zh-TW')} ~ ${new Date(
                        bookingData.courseEndDate,
                      ).toLocaleDateString('zh-TW')}</p>
                    ${
                      bookingData.courseWeekdays && bookingData.courseWeekdays.length > 0
                        ? `
                      <p style="margin: 8px 0;"><strong>上課日期：</strong>每${bookingData.courseWeekdays
                        .map(day => day === 0 ? 7 : day) // 將星期日轉為7
                        .sort((a, b) => a - b) // 排序
                        .map(day => day === 7 ? 0 : day) // 轉回原來的0
                        .map((day: number) => {
                          const weekdays = [
                            '週日',
                            '週一',
                            '週二',
                            '週三',
                            '週四',
                            '週五',
                            '週六',
                          ];
                          return weekdays[day];
                        })
                        .join('、')}</p>
                    `
                        : ''
                    }
                    ${
                      bookingData.courseTimeSlots &&
                      bookingData.courseTimeSlots.length > 0
                        ? `
                      <p style="margin: 8px 0;"><strong>上課時間：</strong>${bookingData.courseTimeSlots
                        .map((slot: TimeSlot) => `${slot.startTime} - ${slot.endTime}`)
                        .join('、')}</p>
                    `
                        : ''
                    }
                  </div>
                `
                    : ''
                }
                
                ${
                  bookingData.bookingDate && bookingData.startTime && bookingData.endTime
                    ? `
                  <h5 style="margin: 15px 0 10px 0; color: #742a2a; font-size: 16px;">⏰ 預約時間</h5>
                  <div style="line-height: 1.8; color: #4a5568;">
                    <p style="margin: 8px 0;"><strong>預約日期：</strong>${new Date(
                      bookingData.bookingDate,
                    ).toLocaleDateString('zh-TW')}</p>
                    <p style="margin: 8px 0;"><strong>預約時段：</strong>${
                      bookingData.startTime
                    } - ${bookingData.endTime}</p>
                  </div>
                `
                    : ''
                }

                ${
                  bookingData.courseFeatures && bookingData.courseFeatures.length > 0
                    ? `
                  <h5 style="margin: 15px 0 10px 0; color: #742a2a; font-size: 16px;">✨ 課程特色</h5>
                  <div style="line-height: 1.8; color: #4a5568;">
                    <ul style="padding-left: 20px; margin: 0;">
                      ${bookingData.courseFeatures.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                  </div>
                `
                    : ''
                }

                ${
                  bookingData.courseRequirements
                    ? `
                  <div style="background: #fffbf0; border-left: 4px solid #d69e2e; padding: 15px; border-radius: 6px; margin: 15px 0;">
                    <h5 style="margin: 0 0 10px 0; color: #744210; font-size: 16px;">⚠️ 參加要求</h5>
                    <p style="margin: 0; color: #975a16; line-height: 1.6;">${bookingData.courseRequirements}</p>
                  </div>
                `
                    : ''
                }
              </div>
            `
                : ''
            }
            <p style="color: #c53030; line-height: 1.6; margin: 15px 0 0 0;">我們的專業顧問將在 24 小時內與您聯繫，確認課程時間和詳細安排。請保持電話暢通。</p>
          </div>
        `
        }

        <!-- Important Notes -->
        <div style="background: linear-gradient(135deg, #fffbf0, #fef5e7); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #d69e2e;">
          <h4 style="margin: 0 0 15px 0; color: #744210; font-size: 16px;">⚠️ 重要注意事項</h4>
          <ul style="color: #975a16; line-height: 1.6; padding-left: 20px; margin: 0;">
            <li>請攜帶運動服裝、毛巾及運動鞋</li>
            <li>如需更換時間，請提前 24 小時聯繫我們</li>
            <li>首次來訪建議提前 10 分鐘到達</li>
            <li>場館內提供置物櫃及淋浴設備</li>
            <li>如有身體不適或特殊狀況，請事先告知</li>
          </ul>
        </div>

        <!-- Contact Information -->
        <div style="background: linear-gradient(135deg, #f7fafc, #edf2f7); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #4a5568;">
          <h4 style="margin: 0 0 15px 0; color: #2d3748; font-size: 16px;">📞 聯絡資訊</h4>
          <div style="color: #4a5568; line-height: 1.8;">
            <p style="margin: 8px 0; font-weight: bold; color: #2d3748;">Focus Space 專心練運動空間</p>
            <p style="margin: 8px 0;">📍 地址：新北市板橋區民生路三段30-1號B1</p>
            <p style="margin: 8px 0;">📞 電話：02-2258-8228</p>
            <p style="margin: 8px 0;">🕐 營業時間：週一至週日 07:00 - 23:00</p>
            <p style="margin: 8px 0;">🌐 官方網站：<a href="https://www.naluwan.website" style="color: #e53e3e;">naluwan.website</a></p>
            <p style="margin: 8px 0;">📧 客服信箱：focusspace4648@gmail.com</p>
          </div>
        </div>

        <!-- Social Media & Links -->
      </div>

      <!-- Footer -->
      <div style="background-color: #2d3748; color: #a0aec0; padding: 20px; text-align: center; font-size: 12px; line-height: 1.6;">
        <p style="margin: 0 0 8px 0;">感謝您選擇 Focus Space，讓我們一起專心練習，達成健身目標！</p>
        <p style="margin: 0; opacity: 0.8;">此郵件為系統自動發送，請勿直接回覆</p>
      </div>
    </div>
  `;

  // 發送給客戶的郵件
  const customerMailOptions = {
    from: process.env.EMAIL_USER,
    to: customerEmail,
    subject: subject,
    html: htmlContent,
  };

  // 發送給店家的通知郵件
  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: `[新預約] ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #e53e3e, #c53030); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">🔔 新預約通知</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Focus Space 專心練運動空間</p>
        </div>
        
        <div style="background-color: #f7fafc; padding: 25px; border-radius: 0 0 8px 8px;">
          <!-- 基本預約資訊 -->
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #e53e3e;">
            <h3 style="margin: 0 0 15px 0; color: #2d3748;">📋 客戶資訊</h3>
            <div style="line-height: 1.8; color: #4a5568;">
              <p style="margin: 8px 0;"><strong>預約類型：</strong><span style="background: ${
                isTrialBooking ? '#48bb78' : '#e53e3e'
              }; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${
      isTrialBooking ? '場館體驗' : '課程預約'
    }</span></p>
              <p style="margin: 8px 0;"><strong>客戶姓名：</strong>${customerName}</p>
              <p style="margin: 8px 0;"><strong>聯絡電話：</strong><a href="tel:+886${customerPhone.replace(
                /^0/,
                '',
              )}" style="color: #e53e3e; text-decoration: none;">${customerPhone}</a></p>
              <p style="margin: 8px 0;"><strong>電子郵件：</strong><a href="mailto:${customerEmail}" style="color: #e53e3e; text-decoration: none;">${customerEmail}</a></p>
              <p style="margin: 8px 0;"><strong>預約時間：</strong>${new Date(
                createdAt,
              ).toLocaleString('zh-TW')}</p>
              ${
                bookingData.bookingNumber
                  ? `<p style="margin: 8px 0;"><strong>預約編號：</strong><code style="background: #edf2f7; padding: 2px 6px; border-radius: 4px; color: #2d3748;">${bookingData.bookingNumber}</code></p>`
                  : ''
              }
              ${
                bookingData.customerNote
                  ? `<p style="margin: 8px 0;"><strong>客戶備註：</strong><em style="color: #718096;">${bookingData.customerNote}</em></p>`
                  : ''
              }
            </div>
          </div>

          ${
            !isTrialBooking && bookingData.courseName
              ? `
            <!-- 課程詳細資訊 -->
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #3182ce;">
              <h3 style="margin: 0 0 15px 0; color: #2d3748;">🏋️ 課程詳情</h3>
              <div style="line-height: 1.8; color: #4a5568;">
                <p style="margin: 8px 0;"><strong>課程名稱：</strong><span style="color: #3182ce; font-weight: 600;">${
                  bookingData.courseName
                }</span></p>
                ${
                  bookingData.courseCategory
                    ? `<p style="margin: 8px 0;"><strong>課程類型：</strong><span style="background: ${
                        bookingData.courseCategory === 'personal'
                          ? '#3182ce'
                          : bookingData.courseCategory === 'group'
                          ? '#38a169'
                          : '#805ad5'
                      }; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${
                        bookingData.courseCategory === 'personal'
                          ? '個人課程'
                          : bookingData.courseCategory === 'group'
                          ? '團體課程'
                          : '特殊課程'
                      }</span></p>`
                    : ''
                }
                ${
                  bookingData.duration
                    ? `<p style="margin: 8px 0;"><strong>課程時長：</strong>${bookingData.duration}分鐘</p>`
                    : ''
                }
                ${
                  bookingData.totalPrice
                    ? `<p style="margin: 8px 0;"><strong>課程費用：</strong><span style="color: #e53e3e; font-weight: 600; font-size: 18px;">NT$ ${bookingData.totalPrice}</span></p>`
                    : ''
                }
                ${
                  bookingData.participantCount
                    ? `<p style="margin: 8px 0;"><strong>參與人數：</strong>${bookingData.participantCount}人</p>`
                    : ''
                }
              </div>

              ${
                bookingData.courseStartDate && bookingData.courseEndDate
                  ? `
                <div style="background: #f0f4f8; padding: 15px; border-radius: 6px; margin: 15px 0;">
                  <h4 style="margin: 0 0 10px 0; color: #2d3748; font-size: 14px;">📅 課程時程安排</h4>
                  <div style="line-height: 1.6; color: #4a5568; font-size: 14px;">
                    <p style="margin: 5px 0;"><strong>課程期間：</strong>${new Date(
                      bookingData.courseStartDate,
                    ).toLocaleDateString('zh-TW')} ~ ${new Date(
                      bookingData.courseEndDate,
                    ).toLocaleDateString('zh-TW')}</p>
                    ${
                      bookingData.courseWeekdays && bookingData.courseWeekdays.length > 0
                        ? `
                      <p style="margin: 5px 0;"><strong>上課日期：</strong>每${bookingData.courseWeekdays
                        .map(day => day === 0 ? 7 : day) // 將星期日轉為7
                        .sort((a, b) => a - b) // 排序
                        .map(day => day === 7 ? 0 : day) // 轉回原來的0
                        .map((day: number) => {
                          const weekdays = [
                            '週日',
                            '週一',
                            '週二',
                            '週三',
                            '週四',
                            '週五',
                            '週六',
                          ];
                          return weekdays[day];
                        })
                        .join('、')}</p>
                    `
                        : ''
                    }
                    ${
                      bookingData.courseTimeSlots &&
                      bookingData.courseTimeSlots.length > 0
                        ? `
                      <p style="margin: 5px 0;"><strong>上課時間：</strong><code style="background: #2d3748; color: white; padding: 2px 6px; border-radius: 4px;">${bookingData.courseTimeSlots
                        .map((slot: TimeSlot) => `${slot.startTime} - ${slot.endTime}`)
                        .join('、')}</code></p>
                    `
                        : ''
                    }
                  </div>
                </div>
              `
                  : ''
              }

              ${
                bookingData.bookingDate && bookingData.startTime && bookingData.endTime
                  ? `
                <div style="background: #fff5f5; padding: 15px; border-radius: 6px; margin: 15px 0; border: 1px solid #fed7d7;">
                  <h4 style="margin: 0 0 10px 0; color: #c53030; font-size: 14px;">⏰ 客戶指定預約時間</h4>
                  <div style="line-height: 1.6; color: #4a5568; font-size: 14px;">
                    <p style="margin: 5px 0;"><strong>預約日期：</strong><span style="color: #c53030; font-weight: 600;">${new Date(
                      bookingData.bookingDate,
                    ).toLocaleDateString('zh-TW', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}</span></p>
                    <p style="margin: 5px 0;"><strong>預約時段：</strong><code style="background: #c53030; color: white; padding: 2px 6px; border-radius: 4px;">${
                      bookingData.startTime
                    } - ${bookingData.endTime}</code></p>
                  </div>
                </div>
              `
                  : ''
              }
            </div>
          `
              : ''
          }

          ${
            isTrialBooking &&
            (bookingData.customerAge ||
              bookingData.customerGender ||
              typeof bookingData.hasExperience === 'boolean' ||
              bookingData.fitnessGoals)
              ? `
            <!-- 體驗預約額外資訊 -->
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #48bb78;">
              <h3 style="margin: 0 0 15px 0; color: #2d3748;">🎯 體驗者資訊</h3>
              <div style="line-height: 1.8; color: #4a5568;">
                ${
                  bookingData.customerGender
                    ? `<p style="margin: 8px 0;"><strong>性別：</strong>${
                        bookingData.customerGender === 'male'
                          ? '男性'
                          : bookingData.customerGender === 'female'
                          ? '女性'
                          : '其他'
                      }</p>`
                    : ''
                }
                ${
                  bookingData.customerAge
                    ? `<p style="margin: 8px 0;"><strong>年齡：</strong>${bookingData.customerAge} 歲</p>`
                    : ''
                }
                ${
                  typeof bookingData.hasExperience === 'boolean'
                    ? `<p style="margin: 8px 0;"><strong>健身經驗：</strong><span style="color: ${
                        bookingData.hasExperience ? '#38a169' : '#e53e3e'
                      };">${
                        bookingData.hasExperience ? '有健身經驗' : '完全新手'
                      }</span></p>`
                    : ''
                }
                ${
                  bookingData.fitnessGoals
                    ? `<p style="margin: 8px 0;"><strong>健身目標：</strong><em>${bookingData.fitnessGoals}</em></p>`
                    : ''
                }
                ${
                  bookingData.preferredDate
                    ? `<p style="margin: 8px 0;"><strong>希望日期：</strong>${bookingData.preferredDate}</p>`
                    : ''
                }
                ${
                  bookingData.preferredTime
                    ? `<p style="margin: 8px 0;"><strong>偏好時段：</strong>${bookingData.preferredTime}</p>`
                    : ''
                }
              </div>
            </div>
          `
              : ''
          }

          <!-- 行動提醒 -->
          <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 8px; text-align: center;">
            <h3 style="margin: 0 0 10px 0;">📞 下一步行動</h3>
            <p style="margin: 0 0 15px 0; opacity: 0.9;">請盡快聯繫客戶安排${
              isTrialBooking ? '體驗' : '課程'
            }時間</p>
            <div style="margin-top: 15px;">
              <a href="tel:+886${customerPhone.replace(
                /^0/,
                '',
              )}" style="background: white; color: #667eea; padding: 8px 16px; border-radius: 6px; text-decoration: none; margin: 0 5px; display: inline-block; font-weight: 600;">📞 撥打電話</a>
              <a href="mailto:${customerEmail}" style="background: white; color: #667eea; padding: 8px 16px; border-radius: 6px; text-decoration: none; margin: 0 5px; display: inline-block; font-weight: 600;">📧 發送郵件</a>
            </div>
          </div>
        </div>
      </div>
    `,
  };

  try {
    // 發送確認郵件給客戶
    await transporter.sendMail(customerMailOptions);
    console.log('Customer email sent successfully');

    // 發送通知郵件給店家
    if (process.env.EMAIL_TO) {
      await transporter.sendMail(adminMailOptions);
      console.log('Admin notification email sent successfully');
    }
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};
