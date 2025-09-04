'use client';
import axios from 'axios';
import React from 'react';
import IGPost from './_components/IGPost';
import LoadingIGPosts from './_components/LoadingIGPosts';
import { PostType } from '@/app/api/ig/route';

const NewsPage = () => {
  const [posts, setPostsData] = React.useState<PostType[] | []>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // 初始化AOS動畫
    if (typeof window !== 'undefined') {
      const AOS = require('aos');
      require('aos/dist/aos.css');
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
      });
    }
  }, []);

  React.useEffect(() => {
    const abortController = new AbortController();
    async function fetchInstagramPost() {
      try {
        // 使用 GET 方法獲取 Instagram 貼文（不再需要 secret）
        const res = await axios.get('/api/ig', {
          signal: abortController.signal,
        });

        // 處理新的回應格式
        const data = res.data.posts || res.data;
        setPostsData(data);
        setError(null);
        
        // 如果是過時的快取資料，顯示警告（可選）
        if (res.data.stale) {
          console.warn('Displaying cached Instagram posts due to API issues');
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request cancelled');
        } else {
          console.error('Error fetching Instagram posts:', err);
          
          // 檢查是否為 token 錯誤
          if (axios.isAxiosError(err) && err.response?.headers?.['x-error-type'] === 'instagram-api-error') {
            setError('Instagram API 連接問題，請稍後再試');
            console.error('Instagram token error - admin action required');
          } else {
            setError('載入 Instagram 貼文時發生錯誤');
          }
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchInstagramPost();
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div className='relative min-h-screen bg-black'>
      {/* 品牌漸層背景 */}
      <div className='absolute inset-0 bg-gradient-to-br from-red-600/10 via-black to-yellow-500/10' />

      {/* Hero 區域 - 品牌化標題 */}
      <div className='relative z-10'>
        <div className='max-container flex flex-col items-center justify-center px-4 py-20 text-center'>
          <h1
            className='mb-4 bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-5xl font-bold text-transparent md:text-7xl'
            data-aos='fade-down'
            data-aos-delay='100'
          >
            最新消息
          </h1>
          <p
            className='mb-8 max-w-2xl text-lg text-gray-300 md:text-xl'
            data-aos='fade-up'
            data-aos-delay='200'
          >
            追蹤 Focus Space 的最新動態、活動資訊與健身知識分享
          </p>

          {/* 社群媒體連結 */}
          <div className='flex gap-4' data-aos='zoom-in' data-aos-delay='300'>
            <a
              href='https://www.instagram.com/focus.space.banqiao/'
              target='_blank'
              rel='noreferrer'
              className='group relative overflow-hidden rounded-full bg-gradient-to-r from-red-600 to-yellow-500 p-[2px] transition-all duration-300 hover:scale-110'
            >
              <div className='flex items-center gap-2 rounded-full bg-black px-6 py-3 transition-all duration-300 group-hover:bg-black/80'>
                <svg
                  className='h-5 w-5 text-white'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z' />
                </svg>
                <span className='text-white'>Instagram</span>
              </div>
            </a>

            <a
              href='https://www.facebook.com/profile.php?id=100088179318429'
              target='_blank'
              rel='noreferrer'
              className='group relative overflow-hidden rounded-full bg-gradient-to-r from-red-600 to-yellow-500 p-[2px] transition-all duration-300 hover:scale-110'
            >
              <div className='flex items-center gap-2 rounded-full bg-black px-6 py-3 transition-all duration-300 group-hover:bg-black/80'>
                <svg
                  className='h-5 w-5 text-white'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                </svg>
                <span className='text-white'>Facebook</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Instagram 貼文區域 */}
      <div className='max-container relative z-10 px-4 pb-20'>
        {/* 區塊標題 */}
        <div className='mb-10 text-center'>
          <h2
            className='mb-2 text-3xl font-bold text-white md:text-4xl'
            data-aos='fade-up'
          >
            Instagram 動態
          </h2>
          <div
            className='mx-auto h-1 w-24 bg-gradient-to-r from-red-600 to-yellow-500'
            data-aos='zoom-in'
            data-aos-delay='100'
          />
        </div>

        {/* 貼文網格 */}
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {isLoading ? (
            <>
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i} data-aos='fade-up' data-aos-delay={i * 50}>
                  <LoadingIGPosts />
                </div>
              ))}
            </>
          ) : error ? (
            <div className='col-span-full py-20 text-center'>
              <div className='mx-auto mb-4 w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center'>
                <svg className='w-8 h-8 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z' />
                </svg>
              </div>
              <p className='text-xl text-gray-400 mb-2'>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className='bg-gradient-to-r from-red-600 to-yellow-500 text-white px-6 py-2 rounded-lg font-medium hover:scale-105 transition-transform duration-300'
              >
                重新載入
              </button>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post, index) => (
              <div key={post.id} data-aos='fade-up' data-aos-delay={index * 50}>
                <IGPost
                  id={post.id}
                  media_url={post.media_url}
                  timestamp={post.timestamp}
                  caption={post.caption}
                  permalink={post.permalink}
                  media_type={post.media_type}
                  thumbnail_url={post.thumbnail_url}
                  carouselAlbum={post.carouselAlbum}
                  isTop={post.isTop}
                />
              </div>
            ))
          ) : (
            <div className='col-span-full py-20 text-center'>
              <div className='mx-auto mb-4 w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center'>
                <svg className='w-8 h-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 7h18l-2 13H5L3 7zm0 0l2-5h14l2 5M9 12h6' />
                </svg>
              </div>
              <p className='text-xl text-gray-400 mb-2'>目前沒有可顯示的貼文</p>
              <p className='text-sm text-gray-500'>請稍後再來查看最新動態</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
