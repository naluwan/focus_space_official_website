'use client';
import React from 'react';
import Image from 'next/image';

import fbBtn from '@/public/fbBtn.png';
import igBtn from '@/public/igBtn.png';

import Aos from 'aos';

const Introduce = () => {
  React.useEffect(() => {
    Aos.init();
  }, []);

  const socialMediaData = [
    {
      title: 'facebook',
      src: 'https://www.facebook.com/profile.php?id=100088179318429',
      icon: fbBtn,
    },
    {
      title: 'instagram',
      src: 'https://www.instagram.com/focus_space_banqiao/',
      icon: igBtn,
    },
  ];
  return (
    <>
      {/* first */}
      <div className='flex h-auto w-full flex-col gap-y-4 p-6 text-white'>
        <div
          className='flex max-w-[45%] flex-col rounded-3xl bg-black/50 p-8 font-bold backdrop-blur-2xl max-md:w-full max-md:max-w-none'
          data-aos='fade-right'
          data-aos-duration={300}
          data-aos-once
        >
          <div className='text-7xl uppercase max-md:text-5xl'>Focus</div>
          <div className='mb-6 text-4xl uppercase max-md:text-2xl'>專心於你的訓練</div>
          <div className='mb-6'>
            專心練運動空間擁有300坪大空間重量訓練、有氧設備齊全、獨立VIP私人教練授課區和專業現場教練，讓你可以專注於當下的訓練
            <br />
            <br />
            自由重量區 ｜ 國際運動健身品牌
            <br />
            多元有氧區 ｜ 自由教練場租
            <br />
            <br />
            營業時間：07:00 - 23:00
            <br />
            地址：新北市板橋區民生路三段30-1號B1
            <div className='flex gap-x-4 py-2'>
              {socialMediaData.map((item) => (
                <div
                  className='group h-8 w-8 overflow-hidden rounded-full'
                  key={item.title}
                >
                  <a href={item.src} target='_black'>
                    <Image
                      src={item.icon}
                      alt='fbBtn'
                      className='h-8 w-8 group-hover:opacity-80'
                      priority
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* second */}
      <div className='flex h-auto w-full flex-col items-end gap-y-4 p-6 text-white'>
        <div
          className='flex w-[45%] max-w-[45%] flex-col rounded-3xl bg-black/50 p-8 font-bold backdrop-blur-2xl max-md:w-full max-md:max-w-none'
          data-aos='fade-left'
          data-aos-duration={300}
          data-aos-once
        >
          <div className='text-7xl uppercase max-md:text-5xl'>Space</div>
          <div className='mb-6 text-4xl uppercase max-md:text-2xl'>最懂你的健身房</div>
          <div className='mb-6'>
            板橋市中心最方便親民健身房 ｜ 捷運新埔五號出口
            <br />
            免入會費、免手續費、不綁約，只要你來運動
            <br />
            <br />
            單次入場｜分鐘計時｜月票制｜季票制
            <br />
            客製化健身指導｜團體課程｜教練場租
            <br />
            <br />
            單次入場 ｜ 自己規劃時段
            <br />
            月季票制 ｜ 買越多送越多
            <br />
            場地租借 ｜ 單次付費
          </div>
        </div>
      </div>
    </>
  );
};

export default Introduce;
