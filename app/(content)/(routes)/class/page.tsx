'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import personalClass from '@/public/personalClass.jpg';
import groupClass from '@/public/groupClass.jpg';
import groupClass2 from '@/public/groupClass-2.jpg';
import React from 'react';
import { cn } from '@/lib/utils';

const ClassPage = () => {
  const [selectedTab, setSelectedTab] = React.useState('');

  React.useEffect(() => {
    setSelectedTab('personal');
  }, []);

  return (
    <div className='max-container flex h-full w-full p-4 text-center'>
      <Tabs defaultValue='personal' className='w-full text-white'>
        <TabsList>
          <TabsTrigger
            value='personal'
            className='text-lg'
            onClick={() => {
              setSelectedTab('personal');
            }}
          >
            1對1、1對2私人教練課
          </TabsTrigger>
          <TabsTrigger
            value='group'
            className='text-lg'
            onClick={() => {
              setSelectedTab('group');
            }}
          >
            團體課程
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value='personal'
          className={cn(
            'my-6 transition-all delay-150 duration-500',
            selectedTab === 'personal' ? 'opacity-100' : 'opacity-0',
          )}
        >
          <div className='flex flex-col md:flex-row'>
            <Image
              width={300}
              height={400}
              className='h-auto w-auto md:h-[800px] md:w-[600px]'
              src={personalClass}
              alt='class image'
              priority
            />
            <div className='mt-4 flex flex-col items-center justify-center md:mt-0'>
              <h1 className='mb-2 text-2xl'>1對1、1對2私人教練課</h1>
              <p className='w-auto text-left text-lg md:w-1/2'>
                根據學生個人需求，安排符合個人需求的專項教練，教練帶領學生一同規劃出合適可執行的個人化訓練課表，課程中給予正確的飲食觀念，透過專業教學，協助學生達成個人目標。
              </p>
              <div className='mt-8 w-auto p-4 text-left text-lg md:p-0'>
                <ul className='list-outside list-disc'>
                  <li>免費高規格測量身體組成，場館使用ACCUMIQ BC380</li>
                  <li>上課免入場費用 並贈送入場時數10小時</li>
                  <li>享獨立VIP私人教練課授課區</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent
          value='group'
          className={cn(
            'my-6 transition-all delay-150 duration-500',
            selectedTab === 'group' ? 'opacity-100' : 'opacity-0',
          )}
        >
          <div className='flex flex-col md:flex-row'>
            <div className='grid w-full gap-y-4'>
              <Image
                width={300}
                height={400}
                className='h-auto w-auto md:h-[400px] md:w-[600px]'
                src={groupClass}
                alt='class image'
                priority
              />
              <Image
                width={300}
                height={400}
                className='hidden h-auto w-auto md:block md:h-[400px] md:w-[600px]'
                src={groupClass2}
                alt='class image'
                priority
              />
            </div>

            <div className='mt-4 flex flex-col items-center justify-center md:mt-0'>
              <h1 className='mb-2 text-2xl'>團體課程</h1>
              <p className='w-auto text-left text-lg md:w-1/2'>
                專心練團課以全身性的肌力、燃脂訓練為主，結合徒手、自身重量、啞鈴、壺鈴、戰繩、藥球等多樣器材，適合健身新手、樂齡長輩、親朋好友結伴同行。
              </p>
              <div className='mt-8 text-left text-lg'>
                <ul className='list-outside list-disc'>
                  <li>團體企業多人包班</li>
                  <li>環狀肌力燃脂專班</li>
                  <li>TRX懸吊系統專班</li>
                  <li>健康樂齡活力專班</li>
                  <li>拳擊格鬥專班</li>
                  <ul className='list-inside list-[square]'>
                    <li>獨立草皮團課授課區</li>
                    <li>4-8人溫馨小班制</li>
                    <li>無延續性新手友善</li>
                    <li>雙月期課享優惠</li>
                  </ul>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassPage;
