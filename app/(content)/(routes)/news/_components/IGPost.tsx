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
import { ArrowUpRightFromCircle, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

// 透過自家伺服器代理 IG CDN 影片,避免行動裝置瀏覽器直接請求被 CDN 拒絕
const proxiedVideoUrl = (url: string) => `/api/ig-media?url=${encodeURIComponent(url)}`;

// IG API 對含版權音樂的影片(如 Reels)不回傳 media_url,改顯示縮圖並導向 Instagram 觀看
const VideoUnavailable = ({
  thumbnail,
  permalink,
}: {
  thumbnail?: string;
  permalink: string;
}) => (
  <a
    href={permalink}
    target='_blank'
    rel='noreferrer'
    className='relative block h-full w-full'
  >
    {thumbnail ? (
      <Image
        src={thumbnail}
        alt='video thumbnail'
        width={400}
        height={300}
        className='h-full w-full object-cover'
        unoptimized
      />
    ) : (
      <div className='h-full w-full bg-gray-800' />
    )}
    <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40'>
      <div className='rounded-full bg-gradient-to-r from-red-600 to-yellow-500 p-4'>
        <Play className='h-8 w-8 fill-white text-white' />
      </div>
      <p className='text-sm text-white'>點擊前往 Instagram 觀看影片</p>
    </div>
  </a>
);

interface IGPostProps {
  id: string;
  caption?: string;
  media_url?: string;
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
  const getPreviewImage = (): string | null => {
    if (media_type === 'IMAGE') return media_url || null;
    if (media_type === 'VIDEO') return thumbnail_url || null;
    if (media_type === 'CAROUSEL_ALBUM' && carouselAlbum?.data) {
      const firstImage = carouselAlbum.data.find((i) => i.media_type === 'IMAGE');
      if (firstImage) return firstImage.media_url;
      const firstVideoWithThumb = carouselAlbum.data.find(
        (i) => i.media_type === 'VIDEO' && i.thumbnail_url,
      );
      if (firstVideoWithThumb) return firstVideoWithThumb.thumbnail_url;
    }
    return null;
  };

  const previewImage = getPreviewImage();

  return (
    <>
      <Card className='group relative overflow-hidden border-gray-800 bg-gray-900/50 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-red-600/50 hover:shadow-2xl hover:shadow-red-600/20 md:max-h-[600px]'>
        {isTop && (
          <div className='absolute right-2 top-2 z-10 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 p-2'>
            <ArrowUpRightFromCircle className='h-5 w-5 text-white' />
          </div>
        )}
        <CardHeader className='md:max-h-[355px] lg:max-h-[315px] xl:max-h-[450px]'>
          {/* 電腦版post預覽圖 - 只顯示一張 */}
          <div className='hidden overflow-hidden rounded-md md:block md:h-[400px]'>
            {previewImage ? (
              <Image
                src={previewImage}
                alt='post image'
                width={400}
                height={300}
                className={cn('h-full w-full object-cover')}
                priority={isTop}
                loading={isTop ? 'eager' : 'lazy'}
                unoptimized
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center bg-gray-800 text-gray-400'>
                <div className='text-center'>
                  <svg
                    className='mx-auto h-12 w-12 mb-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                    />
                  </svg>
                  <p className='text-sm'>影片貼文</p>
                  <p className='text-xs text-gray-500'>點擊查看更多</p>
                </div>
              </div>
            )}
          </div>
          {/* 手機版圖片,影片或輪播圖 */}
          <div className='overflow-hidden rounded-md md:hidden h-[300px]'>
            {/* ig圖片 */}
            {media_type === 'IMAGE' && media_url && (
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
            {media_type === 'VIDEO' &&
              (media_url ? (
                <VideoPlayer
                  key={`mobile-${id}`}
                  id={`mobile-${id}`}
                  options={{
                    sources: [{ src: proxiedVideoUrl(media_url), type: 'video/mp4' }],
                    autoplay: false,
                    poster: thumbnail_url,
                  }}
                />
              ) : (
                <VideoUnavailable thumbnail={thumbnail_url} permalink={permalink} />
              ))}

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
                        {item.media_url ? (
                          <VideoPlayer
                            key={`mobile-album-${item.id}`}
                            id={`mobile-album-${item.id}`}
                            options={{
                              sources: [
                                {
                                  src: proxiedVideoUrl(item.media_url),
                                  type: 'video/mp4',
                                },
                              ],
                              poster: item.thumbnail_url,
                              autoplay: false,
                            }}
                          />
                        ) : (
                          <VideoUnavailable
                            thumbnail={item.thumbnail_url}
                            permalink={permalink}
                          />
                        )}
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
            <p className='text-sm text-gray-400'>
              {new Date(timestamp).toLocaleDateString()}
            </p>
            <a
              href={permalink}
              target='_blank'
              rel='noreferrer'
              className='group inline-flex items-center gap-1 text-sm font-medium text-red-600 transition-all duration-300 hover:text-yellow-500'
            >
              <span>查看Instagram</span>
              <svg
                className='h-4 w-4 transition-transform group-hover:translate-x-1'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                />
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
                    'flex max-h-[750px] max-w-[90%] items-center justify-around bg-gray-900 data-[state=open]:duration-500 max-md:hidden',
                  )}
                >
                  {/* post圖片,影片或輪播圖 */}
                  <div className='flex h-[750px] w-full items-center justify-center'>
                    {/* ig圖片 */}
                    {media_type === 'IMAGE' && media_url && (
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
                    {media_type === 'VIDEO' &&
                      (media_url ? (
                        <VideoPlayer
                          key={`web-${id}`}
                          id={`web-${id}`}
                          options={{
                            sources: [
                              { src: proxiedVideoUrl(media_url), type: 'video/mp4' },
                            ],
                            poster: thumbnail_url,
                            autoplay: true,
                          }}
                        />
                      ) : (
                        <VideoUnavailable
                          thumbnail={thumbnail_url}
                          permalink={permalink}
                        />
                      ))}

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
                                {item.media_url ? (
                                  <VideoPlayer
                                    key={`web-album-${item.id}`}
                                    id={`web-album-${item.id}`}
                                    options={{
                                      sources: [
                                        {
                                          src: proxiedVideoUrl(item.media_url),
                                          type: 'video/mp4',
                                        },
                                      ],
                                      poster: item.thumbnail_url,
                                      autoplay: false,
                                    }}
                                  />
                                ) : (
                                  <VideoUnavailable
                                    thumbnail={item.thumbnail_url}
                                    permalink={permalink}
                                  />
                                )}
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
                      <p className='text-sm text-gray-400'>
                        {new Date(timestamp).toLocaleDateString()}
                      </p>
                      <a
                        href={permalink}
                        target='_blank'
                        rel='noreferrer'
                        className='group inline-flex items-center gap-1 text-sm font-medium text-red-600 transition-all duration-300 hover:text-yellow-500'
                      >
                        <span>在Instagram查看</span>
                        <svg
                          className='h-4 w-4 transition-transform group-hover:translate-x-1'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                          />
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
