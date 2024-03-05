import { Button } from '@/components/ui/button';
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
    data: { id: string; media_type: 'IMAGE' | 'VIDEO'; media_url: string }[];
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
      <Card className='relative transition-all duration-500 hover:scale-105 md:max-h-[600px]'>
        {isTop && <ArrowUpRightFromCircle className='absolute right-1 top-1' />}
        <CardHeader className='md:max-h-[355px] lg:max-h-[315px] xl:max-h-[450px]'>
          {/* 電腦版post預覽圖 */}
          <div className='hidden overflow-hidden rounded-md md:block md:h-[400px]'>
            <Image
              src={
                media_type === 'IMAGE' || media_type === 'CAROUSEL_ALBUM'
                  ? media_url
                  : (thumbnail_url as string)
              }
              alt='post image'
              width={400}
              height={300}
              className={cn('w-full object-cover', media_type === 'VIDEO' && 'h-full')}
              priority
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
                priority
              />
            )}

            {/* ig影片 */}
            {media_type === 'VIDEO' && (
              <VideoPlayer
                key={`mobile-${id}`}
                options={{
                  sources: [{ src: media_url }],
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
                          options={{
                            sources: [{ src: item.media_url }],
                            autoplay: true,
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
          <div className='flex w-1/2 items-center justify-between'>
            <p>{new Date(timestamp).toLocaleDateString()}</p>
            <Button variant='link'>
              <a href={permalink} target='_blank' rel='noreferrer'>
                連結Instagram貼文
              </a>
            </Button>
          </div>
          <div className='h-auto whitespace-pre-line'>
            <p className='md:line-clamp-3'>{caption}</p>
            <div className='flex justify-end pt-2'>
              <Dialog>
                <DialogTrigger asChild className='hidden md:block'>
                  <Button>查看更多</Button>
                </DialogTrigger>
                <DialogContent
                  className={cn(
                    'flex max-h-[750px] max-w-[90%] justify-around data-[state=open]:duration-500 max-md:hidden',
                    media_type === 'VIDEO' ? 'items-center' : 'items-start ',
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
                        options={{ sources: [{ src: media_url }], autoplay: true }}
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
                                  options={{
                                    sources: [{ src: item.media_url }],
                                    autoplay: true,
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
                  <div className='max-h-[750px] w-[65%] overflow-y-auto py-8'>
                    <div className='flex w-1/2 items-center justify-between'>
                      <p>{new Date(timestamp).toLocaleDateString()}</p>
                      <Button variant='link'>
                        <a href={permalink} target='_blank' rel='noreferrer'>
                          連結Instagram貼文
                        </a>
                      </Button>
                    </div>
                    <p className='whitespace-pre-line'>{caption}</p>
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
