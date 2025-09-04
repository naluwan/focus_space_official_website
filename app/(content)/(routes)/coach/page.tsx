'use client';
import { COACH_DATA } from '@/public/constants';
import CoachImage from './_components/coach-image';
import React from 'react';
import { StaticImageData } from 'next/image';
import ScrollToTop from '@/components/ScrollToTop';

import Aos from 'aos';

type PaginationType = {
  pages: number[];
  totalPage: number;
  currentPage: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
};

type CoachDataType = {
  img: StaticImageData;
  key: string;
};

const CoachPage = () => {
  const [filteredData, setFilteredData] = React.useState<CoachDataType[]>([]);
  const [currentData, setCurrentData] = React.useState<CoachDataType[]>([]);
  const [limit] = React.useState(9);
  const [pagination, setPagination] = React.useState<PaginationType | null>();
  const [page, setPage] = React.useState(1);
  const [offset, setOffset] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  // 獲取顯示偏移量
  const getOffset = React.useCallback(
    (limitNumber = 12, page = 1) => (page - 1) * limitNumber,
    [],
  );

  // 獲取分頁資訊
  const getPagination = React.useCallback(
    (limitNumber = 12, pageNumber = 1, total = 50) => {
      const totalPage = Math.ceil(total / limitNumber);
      const pages = Array.from({ length: totalPage }, (_, index) => index + 1);
      const currentPage =
        pageNumber < 1 ? 1 : pageNumber > totalPage ? totalPage : pageNumber;
      const hasPrevPage = currentPage - 1 >= 1;
      const hasNextPage = currentPage + 1 <= totalPage;
      return {
        pages,
        totalPage,
        currentPage,
        hasPrevPage,
        hasNextPage,
      };
    },
    [],
  );

  // 初始化捲軸動畫
  React.useEffect(() => {
    Aos.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  // 獲取該分頁的教練資料
  React.useEffect(() => {
    setFilteredData(COACH_DATA.slice(offset, offset + limit));
  }, [offset, limit]);

  // 將所有教練資料組合
  React.useEffect(() => {
    setCurrentData((prev) => prev.concat(filteredData));
  }, [filteredData]);

  // 更新偏移量和pagination
  React.useEffect(() => {
    setOffset(getOffset(limit, page));
    setPagination(getPagination(limit, page, COACH_DATA.length));
  }, [limit, page, getOffset, getPagination]);

  // 載入更多教練
  const handleLoadMore = () => {
    setIsLoading(true);
    // 模擬載入延遲
    setTimeout(() => {
      setPage(page + 1);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className='relative min-h-screen bg-black'>
      {/* 品牌漸層背景 */}
      <div className='absolute inset-0 bg-gradient-to-br from-red-600/10 via-black to-yellow-500/10' />
      
      {/* Hero 區域 */}
      <div className='relative z-10'>
        <div className='max-container flex flex-col items-center justify-center px-4 pt-20 pb-10 text-center'>
          <h1 
            className='mb-4 bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-5xl font-bold text-transparent md:text-7xl'
            data-aos='fade-down'
            data-aos-delay='100'
          >
            教練陣容
          </h1>
          <p 
            className='mb-8 max-w-2xl text-lg text-gray-300 md:text-xl'
            data-aos='fade-up'
            data-aos-delay='200'
          >
            專業認證教練團隊，陪您達成健身目標
          </p>
          
          {/* 統計數據 */}
          <div 
            className='grid grid-cols-3 gap-8 md:gap-16'
            data-aos='zoom-in'
            data-aos-delay='300'
          >
            <div className='text-center'>
              <p className='text-3xl font-bold text-yellow-500 md:text-4xl'>{COACH_DATA.length}+</p>
              <p className='text-sm text-gray-400'>專業教練</p>
            </div>
            <div className='text-center'>
              <p className='text-3xl font-bold text-yellow-500 md:text-4xl'>10+</p>
              <p className='text-sm text-gray-400'>年經驗</p>
            </div>
            <div className='text-center'>
              <p className='text-3xl font-bold text-yellow-500 md:text-4xl'>1000+</p>
              <p className='text-sm text-gray-400'>學員好評</p>
            </div>
          </div>
        </div>
      </div>

      {/* 教練展示區 */}
      <div className='relative z-10 flex flex-col items-center px-4 pb-20 text-white'>
        <div className='max-container grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8'>
          {currentData.length > 0 ? (
            currentData.map((coach, idx) => {
              const delayData = [100, 200, 300, 400, 500, 600, 700, 800, 900];
              const delay = delayData[idx % delayData.length];
              return (
                <CoachImage 
                  key={coach.key}
                  img={coach.img} 
                  delay={delay} 
                />
              );
            })
          ) : (
            <div className='col-span-full flex h-40 items-center justify-center'>
              <div className='h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-yellow-500' />
            </div>
          )}
        </div>

        {/* 載入更多按鈕 */}
        <div className='mt-16'>
          <button
            className='group relative overflow-hidden rounded-full bg-gradient-to-r from-red-600 to-yellow-500 p-[2px] transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100'
            disabled={!pagination?.hasNextPage || isLoading}
            onClick={handleLoadMore}
            data-aos='fade-up'
            data-aos-duration={700}
            data-aos-anchor-placement='center-bottom'
            data-aos-once
          >
            <span className='flex h-20 w-20 items-center justify-center rounded-full bg-black text-sm font-bold text-white transition-all duration-300 group-hover:bg-black/80'>
              {isLoading ? (
                <div className='h-5 w-5 animate-spin rounded-full border-2 border-gray-600 border-t-white' />
              ) : pagination?.hasNextPage ? (
                '載入更多'
              ) : (
                '沒有更多'
              )}
            </span>
          </button>
        </div>
      </div>
      
      <ScrollToTop />
    </div>
  );
};

export default React.memo(CoachPage);