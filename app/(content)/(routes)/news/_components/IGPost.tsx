import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import VideoPlayer from '@/components/VideoPlayer';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ArrowUpRightFromCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IGPostProps {
  id: string;
  caption?: string;
  media_url: string;
  timestamp: string;
  permalink: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  thumbnail_url?: string;
  carouselAlbum?: {
    data: {
      id: string;
      media_type: 'IMAGE' | 'VIDEO';
      media_url: string;
      thumbnail_url: string;
    }[];
  };
  isTop: boolean;
}

const IGPost = ({
  id,
  caption,
  media_url,
  timestamp,
  permalink,
  media_type,
  thumbnail_url,
  carouselAlbum,
  isTop,
}: IGPostProps) => {
  return (
    <>
      <Card className='group relative overflow-hidden border-gray-800 bg-gray-900/50 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-red-600/50 hover:shadow-2xl hover:shadow-red-600/20 md:max-h-[600px]'>
        {isTop && (
          <div className='absolute right-2 top-2 z-10 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 p-2'>
            <ArrowUpRightFromCircle className='h-5 w-5 text-white' />
          </div>
        )}
        <CardHeader className='md:max-h-[355px] lg:max-h-[315px] xl:max-h-[450px]'>
          {/* 電腦版post預覽圖 */}
          <div className='hidden overflow-hidden rounded-md md:block md:h-[400px]'>
            <Image
              src={
                media_type === 'IMAGE' 
                  ? media_url
                  : media_type === 'CAROUSEL_ALBUM' && carouselAlbum?.data?.[0]
                  ? carouselAlbum.data[0].media_type === 'VIDEO' 
                    ? carouselAlbum.data[0].thumbnail_url 
                    : carouselAlbum.data[0].media_url
                  : media_type === 'VIDEO'
                  ? (thumbnail_url as string)
                  : media_url
              }
              alt='post image'
              width={400}
              height={300}
              className={cn('w-full object-cover', media_type === 'VIDEO' && 'h-full')}
              priority={isTop}
              loading={isTop ? 'eager' : 'lazy'}
            />
          </div>
          {/* 手機版圖片,影片或輪播圖 */}
          <div className='block overflow-hidden rounded-md md:hidden md:h-[300px]'>
            {/* ig圖片 */}
            {media_type === 'IMAGE' && (
              <Image
                src={media_url}
                alt='post image'
                width={400}
                height={300}
                className='w-full object-cover md:h-[300px]'
                priority={false}
              />
            )}

            {/* ig影片 */}
            {media_type === 'VIDEO' && (
              <VideoPlayer
                key={`mobile-${id}`}
                id={`mobile-${id}`}
                options={{
                  sources: [{ src: media_url, type: 'video/mp4' }],
                  autoplay: false,
                  poster: thumbnail_url,
                }}
              />
            )}

            {/* ig多張圖片或影片輪播 */}
            {media_type === 'CAROUSEL_ALBUM' && (
              <Carousel className='w-full'>
                <CarouselContent className=''>
                  {carouselAlbum?.data.map((item) => {
                    return item.media_type === 'IMAGE' ? (
                      <CarouselItem key={item.id}>
                        <Image
                          src={item.media_url}
                          alt='post image'
                          width={400}
                          height={300}
                          className='w-full object-cover md:h-[300px]'
                          priority
                        />
                      </CarouselItem>
                    ) : (
                      <CarouselItem key={item.id}>
                        <VideoPlayer
                          key={`mobile-album-${item.id}`}
                          id={`mobile-album-${item.id}`}
                          options={{
                            sources: [
                              {
                                src: item.media_url,
                                type: 'video/mp4',
                              },
                            ],
                            poster: item.thumbnail_url,
                            autoplay: false,
                          }}
                        />
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between'>
            <p className='text-sm text-gray-400'>{new Date(timestamp).toLocaleDateString()}</p>
            <a
              href={permalink}
              target='_blank'
              rel='noreferrer'
              className='group inline-flex items-center gap-1 text-sm font-medium text-red-600 transition-all duration-300 hover:text-yellow-500'
            >
              <span>查看Instagram</span>
              <svg className='h-4 w-4 transition-transform group-hover:translate-x-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' />
              </svg>
            </a>
          </div>
          <div className='h-auto whitespace-pre-line'>
            <p className='text-gray-300 md:truncate'>{caption}</p>
            <div className='flex justify-end pt-2'>
              <Dialog>
                <DialogTrigger asChild className='hidden md:block'>
                  <button className='group relative overflow-hidden rounded-full bg-gradient-to-r from-red-600 to-yellow-500 p-[2px] transition-all duration-300 hover:scale-110'>
                    <span className='flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-all duration-300 group-hover:bg-gray-900/80'>
                      查看更多
                    </span>
                  </button>
                </DialogTrigger>
                <DialogContent
                  className={cn(
                    'flex max-h-[750px] max-w-[90%] justify-around items-start data-[state=open]:duration-500 max-md:hidden bg-gray-900',
                  )}
                >
                  {/* post圖片,影片或輪播圖 */}
                  <div className='w-full'>
                    {/* ig圖片 */}
                    {media_type === 'IMAGE' && (
                      <Image
                        src={media_url}
                        alt='post image'
                        width={400}
                        height={300}
                        className='h-[750px] w-full object-cover'
                        priority
                      />
                    )}

                    {/* ig影片 */}
                    {media_type === 'VIDEO' && (
                      <VideoPlayer
                        key={`web-${id}`}
                        id={`web-${id}`}
                        options={{
                          sources: [{ src: media_url, type: 'video/mp4' }],
                          poster: thumbnail_url,
                          autoplay: true,
                        }}
                      />
                    )}

                    {/* ig多張圖片或影片輪播 */}
                    {media_type === 'CAROUSEL_ALBUM' && (
                      <Carousel className='w-full'>
                        <CarouselContent className=''>
                          {carouselAlbum?.data.map((item) => {
                            return item.media_type === 'IMAGE' ? (
                              <CarouselItem key={item.id}>
                                <Image
                                  src={item.media_url}
                                  alt='post image'
                                  width={400}
                                  height={300}
                                  className='h-[750px] w-full object-cover'
                                  priority
                                />
                              </CarouselItem>
                            ) : (
                              <CarouselItem key={item.id}>
                                <VideoPlayer
                                  key={`web-album-${item.id}`}
                                  id={`web-album-${item.id}`}
                                  options={{
                                    sources: [{ src: item.media_url, type: 'video/mp4' }],
                                    poster: item.thumbnail_url,
                                    autoplay: false,
                                  }}
                                />
                              </CarouselItem>
                            );
                          })}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                      </Carousel>
                    )}
                  </div>
                  {/* post文字 */}
                  <div className='max-h-[750px] w-[65%] overflow-y-auto bg-gray-900 p-8'>
                    <div className='mb-4 flex items-center justify-between border-b border-gray-800 pb-4'>
                      <p className='text-sm text-gray-400'>{new Date(timestamp).toLocaleDateString()}</p>
                      <a
                        href={permalink}
                        target='_blank'
                        rel='noreferrer'
                        className='group inline-flex items-center gap-1 text-sm font-medium text-red-600 transition-all duration-300 hover:text-yellow-500'
                      >
                        <span>在Instagram查看</span>
                        <svg className='h-4 w-4 transition-transform group-hover:translate-x-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' />
                        </svg>
                      </a>
                    </div>
                    <p className='whitespace-pre-line text-gray-300'>{caption}</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default IGPost;
