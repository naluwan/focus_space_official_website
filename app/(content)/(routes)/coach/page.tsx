'use client';
import { COACH_DATA } from '@/public/constants';
import CoachImage from './_components/coach-image';
import React from 'react';
import { StaticImageData } from 'next/image';
import { Button } from '@/components/ui/button';
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
    Aos.init();
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

  return (
    <div className='flex h-auto flex-col items-center bg-black p-4 text-white'>
      <div className='max-container flex flex-wrap justify-evenly gap-4 md:grid md:grid-cols-3'>
        {currentData.length > 0 ? (
          currentData.map((coach, idx) => {
            const delayData = [100, 200, 300, 400, 500, 600, 700, 800, 900];
            const delay = delayData[idx % delayData.length];
            return <CoachImage img={coach.img} key={coach.key} delay={delay} />;
          })
        ) : (
          <div className='h-full w-full'>載入中</div>
        )}
      </div>

      <div className='mt-10'>
        <Button
          className='h-20 w-20 rounded-full bg-[#E81E26] text-sm font-extrabold tracking-widest ring-4 ring-transparent transition-all duration-300 hover:bg-[#E81E26] hover:ring-[#E81E26]/40 disabled:bg-[#E81E26]/80'
          disabled={!pagination?.hasNextPage}
          onClick={() => setPage(page + 1)}
          data-aos='fade-up'
          data-aos-duration={700}
          data-aos-anchor-placement='center-bottom'
          data-aos-once
        >
          {pagination?.hasNextPage ? '載入更多' : '沒有更多'}
        </Button>
      </div>
      <ScrollToTop />
    </div>
  );
};

export default React.memo(CoachPage);
