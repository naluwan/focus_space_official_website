'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import personalClass from '@/public/personalClass.jpg';
import groupClass from '@/public/groupClass.jpg';
import groupClass2 from '@/public/groupClass-2.jpg';
import React from 'react';
import { cn } from '@/lib/utils';
import CourseCalendar from '@/components/CourseCalendar/CourseCalendar';

const ClassPage = () => {
  const [personalCourses, setPersonalCourses] = React.useState([]);
  const [groupCourses, setGroupCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('personal');

  React.useEffect(() => {
    // 獲取課程資料
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        if (response.ok) {
          const data = await response.json();
          const courses = data.data || [];

          // 根據類別分組
          setPersonalCourses(
            courses.filter(
              (course: { category: string }) => course.category === 'personal',
            ),
          );
          setGroupCourses(
            courses.filter((course: { category: string }) => course.category === 'group'),
          );
        }
      } catch (error) {
        setPersonalCourses([]);
        setGroupCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();

    // 延遲初始化AOS動畫，確保DOM準備完成
    const initAOS = () => {
      if (typeof window !== 'undefined') {
        const AOS = require('aos');
        require('aos/dist/aos.css');
        AOS.init({
          duration: 1000,
          easing: 'ease-in-out',
          once: true,
        });
      }
    };

    // 延遲執行確保組件完全渲染
    setTimeout(initAOS, 500);
  }, []);

  // 個人課程內容渲染函數
  const renderPersonalContent = () => {
    // 如果有個人課程資料，顯示日曆
    if (!loading && personalCourses.length > 0) {
      return (
        <div className='space-y-8'>
          <div data-aos='fade-up' data-aos-delay='600'>
            <CourseCalendar
              category='personal'
              className='mb-8'
            />
          </div>

          {/* 保留原有的介紹文字 */}
          <div
            className='rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm'
            data-aos='fade-up'
            data-aos-delay='500'
          >
            <h2 className='mb-6 bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-3xl font-bold text-transparent md:text-4xl'>
              1對1、1對2私人教練課
            </h2>
            <p className='mb-8 text-lg leading-relaxed text-gray-300'>
              根據學生個人需求，安排符合個人需求的專項教練，教練帶領學生一同規劃出合適可執行的個人化訓練課表，課程中給予正確的飲食觀念，透過專業教學，協助學生達成個人目標。
            </p>

            <div className='space-y-4'>
              <h3 className='text-xl font-semibold text-yellow-500'>專屬優惠</h3>
              <ul className='space-y-3'>
                <li className='flex items-start gap-3'>
                  <span className='mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-red-600 to-yellow-500' />
                  <span className='text-gray-300'>
                    免費高規格測量身體組成，場館使用ACCUMIQ BC380
                  </span>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-red-600 to-yellow-500' />
                  <span className='text-gray-300'>
                    上課免入場費用 並贈送入場時數10小時
                  </span>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-red-600 to-yellow-500' />
                  <span className='text-gray-300'>享獨立VIP私人教練課授課區</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    // 沒有課程資料時顯示原有靜態內容
    return (
      <div className='flex flex-col gap-8 md:flex-row md:gap-12'>
        <div
          className='relative overflow-hidden rounded-2xl'
          data-aos='fade-right'
          data-aos-delay='400'
        >
          <Image
            width={600}
            height={800}
            className='h-auto w-full object-cover md:h-[600px] md:w-[500px]'
            src={personalClass}
            alt='personal training class'
            priority
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />
        </div>

        <div
          className='flex flex-col justify-center text-left'
          data-aos='fade-left'
          data-aos-delay='500'
        >
          <h2 className='mb-6 bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-3xl font-bold text-transparent md:text-4xl'>
            1對1、1對2私人教練課
          </h2>
          <p className='mb-8 text-lg leading-relaxed text-gray-300'>
            根據學生個人需求，安排符合個人需求的專項教練，教練帶領學生一同規劃出合適可執行的個人化訓練課表，課程中給予正確的飲食觀念，透過專業教學，協助學生達成個人目標。
          </p>

          <div className='space-y-4'>
            <h3 className='text-xl font-semibold text-yellow-500'>專屬優惠</h3>
            <ul className='space-y-3'>
              <li className='flex items-start gap-3'>
                <span className='mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-red-600 to-yellow-500' />
                <span className='text-gray-300'>
                  免費高規格測量身體組成，場館使用ACCUMIQ BC380
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <span className='mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-red-600 to-yellow-500' />
                <span className='text-gray-300'>上課免入場費用 並贈送入場時數10小時</span>
              </li>
              <li className='flex items-start gap-3'>
                <span className='mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-red-600 to-yellow-500' />
                <span className='text-gray-300'>享獨立VIP私人教練課授課區</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // 團體課程內容渲染函數
  const renderGroupContent = () => {
    // 如果有團體課程資料，顯示簡介+日曆
    if (!loading && groupCourses.length > 0) {
      return (
        <div className='space-y-8'>
          {/* 課程簡介 */}
          <div
            className='rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm'
            data-aos='fade-up'
            data-aos-delay='400'
          >
            <h2 className='mb-6 bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-3xl font-bold text-transparent md:text-4xl'>
              團體課程
            </h2>
            <p className='mb-8 text-lg leading-relaxed text-gray-300'>
              專心練團課以全身性的肌力、燃脂訓練為主，結合徒手、自身重量、啞鈴、壺鈴、戰繩、藥球等多樣器材，適合健身新手、樂齡長輩、親朋好友結伴同行。
            </p>

            <div className='space-y-4'>
              <h3 className='text-xl font-semibold text-yellow-500'>課程類型</h3>
              <ul className='space-y-3'>
                <li className='flex items-start gap-3'>
                  <span className='mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-red-600 to-yellow-500' />
                  <span className='text-gray-300'>團體企業多人包班</span>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-red-600 to-yellow-500' />
                  <span className='text-gray-300'>環狀肌力燃脂專班</span>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-red-600 to-yellow-500' />
                  <span className='text-gray-300'>TRX懸吊系統專班</span>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-red-600 to-yellow-500' />
                  <span className='text-gray-300'>健康樂齡活力專班</span>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-red-600 to-yellow-500' />
                  <span className='text-gray-300'>拳擊格鬥專班</span>
                </li>
              </ul>
            </div>

            <div className='mt-6 rounded-lg border border-gray-800 bg-gray-900/50 p-4 backdrop-blur-sm'>
              <div className='grid grid-cols-2 gap-4 text-center'>
                <div>
                  <p className='text-2xl font-bold text-yellow-500'>4-8人</p>
                  <p className='text-sm text-gray-400'>溫馨小班制</p>
                </div>
                <div>
                  <p className='text-2xl font-bold text-yellow-500'>獨立草皮</p>
                  <p className='text-sm text-gray-400'>團課授課區</p>
                </div>
              </div>
            </div>
          </div>

          {/* 課程時間表 */}
          <div data-aos='fade-up' data-aos-delay='600'>
            <CourseCalendar
              category='group'
              className=''
            />
          </div>
        </div>
      );
    }

    // 沒有課程資料時顯示原有靜態內容
    return (
      <div className='flex flex-col gap-8 md:flex-row md:gap-12'>
        <div className='grid gap-4'>
          <div className='relative overflow-hidden rounded-2xl'>
            <Image
              width={600}
              height={400}
              className='h-auto w-full object-cover md:h-[290px] md:w-[500px]'
              src={groupClass}
              alt='group class 1'
              priority
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />
          </div>
          <div className='relative hidden overflow-hidden rounded-2xl md:block'>
            <Image
              width={600}
              height={400}
              className='h-auto w-full object-cover md:h-[290px] md:w-[500px]'
              src={groupClass2}
              alt='group class 2'
              priority
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />
          </div>
        </div>

        <div
          className='flex flex-col justify-center text-left'
          data-aos='fade-left'
          data-aos-delay='500'
        >
          <h2 className='mb-6 bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-3xl font-bold text-transparent md:text-4xl'>
            團體課程
          </h2>
          <p className='mb-8 text-lg leading-relaxed text-gray-300'>
            專心練團課以全身性的肌力、燃脂訓練為主，結合徒手、自身重量、啞鈴、壺鈴、戰繩、藥球等多樣器材，適合健身新手、樂齡長輩、親朋好友結伴同行。
          </p>

          <div className='space-y-4'>
            <h3 className='text-xl font-semibold text-yellow-500'>課程類型</h3>
            <ul className='space-y-3'>
              <li className='flex items-start gap-3'>
                <span className='mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-red-600 to-yellow-500' />
                <span className='text-gray-300'>團體企業多人包班</span>
              </li>
              <li className='flex items-start gap-3'>
                <span className='mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-red-600 to-yellow-500' />
                <span className='text-gray-300'>環狀肌力燃脂專班</span>
              </li>
              <li className='flex items-start gap-3'>
                <span className='mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-red-600 to-yellow-500' />
                <span className='text-gray-300'>TRX懸吊系統專班</span>
              </li>
              <li className='flex items-start gap-3'>
                <span className='mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-red-600 to-yellow-500' />
                <span className='text-gray-300'>健康樂齡活力專班</span>
              </li>
              <li className='flex items-start gap-3'>
                <span className='mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-red-600 to-yellow-500' />
                <span className='text-gray-300'>拳擊格鬥專班</span>
              </li>
            </ul>
          </div>

          <div className='mt-6 rounded-lg border border-gray-800 bg-gray-900/50 p-4 backdrop-blur-sm'>
            <div className='grid grid-cols-2 gap-4 text-center'>
              <div>
                <p className='text-2xl font-bold text-yellow-500'>4-8人</p>
                <p className='text-sm text-gray-400'>溫馨小班制</p>
              </div>
              <div>
                <p className='text-2xl font-bold text-yellow-500'>獨立草皮</p>
                <p className='text-sm text-gray-400'>團課授課區</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='relative min-h-screen bg-black'>
      {/* 品牌漸層背景 */}
      <div className='absolute inset-0 bg-gradient-to-br from-red-600/10 via-black to-yellow-500/10' />

      {/* Hero 區域 */}
      <div className='relative z-10'>
        <div className='max-container flex flex-col items-center justify-center px-4 pb-10 pt-20 text-center'>
          <h1
            className='mb-4 bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-5xl font-bold text-transparent md:text-7xl'
            data-aos='fade-down'
            data-aos-delay='100'
          >
            專心練課程
          </h1>
          <p
            className='mb-8 max-w-2xl text-lg text-gray-300 md:text-xl'
            data-aos='fade-up'
            data-aos-delay='200'
          >
            專業教練團隊，量身打造您的專屬訓練計畫
          </p>
        </div>
      </div>

      {/* 課程內容 */}
      <div className='max-container relative z-10 px-4 pb-20'>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='w-full text-white'
        >
          <TabsList
            className='mb-10 h-auto border border-gray-800 bg-gray-900/50 p-1 backdrop-blur-sm'
            data-aos='zoom-in'
            data-aos-delay='300'
          >
            <TabsTrigger
              value='personal'
              className={cn(
                'rounded-lg px-6 py-3 text-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-lg',
                'text-gray-400 hover:bg-white/10 hover:text-white',
              )}
            >
              1對1、1對2私人教練課
            </TabsTrigger>
            <TabsTrigger
              value='group'
              className={cn(
                'rounded-lg px-6 py-3 text-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-lg',
                'text-gray-400 hover:bg-white/10 hover:text-white',
              )}
            >
              團體課程
            </TabsTrigger>
          </TabsList>

          <TabsContent value='personal'>
            <div
              className={`transition-all duration-300 ${
                activeTab === 'personal' ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              {loading ? (
                <div className='animate-pulse'>
                  <div className='mb-4 h-64 rounded-2xl bg-gray-700'></div>
                  <div className='mb-2 h-4 w-3/4 rounded bg-gray-700'></div>
                  <div className='h-4 w-1/2 rounded bg-gray-700'></div>
                </div>
              ) : (
                renderPersonalContent()
              )}
            </div>
          </TabsContent>

          <TabsContent value='group'>
            <div
              className={`transition-all duration-300 ${
                activeTab === 'group' ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              {loading ? (
                <div className='animate-pulse'>
                  <div className='mb-4 h-64 rounded-2xl bg-gray-700'></div>
                  <div className='mb-2 h-4 w-3/4 rounded bg-gray-700'></div>
                  <div className='h-4 w-1/2 rounded bg-gray-700'></div>
                </div>
              ) : (
                renderGroupContent()
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClassPage;
