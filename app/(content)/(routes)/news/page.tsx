'use client';
import axios from 'axios';
import React from 'react';
import IGPost from './_components/IGPost';
import LoadingIGPosts from './_components/LoadingIGPosts';
import { PostType } from '@/app/api/ig/route';

const NewsPage = () => {
  const [posts, setPostsData] = React.useState<PostType[] | []>([]);

  React.useEffect(() => {
    const abortController = new AbortController();
    async function fetchInstagramPost() {
      try {
        const res = await axios.post('/api/ig', {
          secret: process.env.NEXT_PUBLIC_API_SECRET,
        });

        setPostsData(res.data);
      } catch (err) {
        console.log('error', err);
      }
    }
    fetchInstagramPost();
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div className='max-container h-auto'>
      <div className='grid grid-cols-1 gap-10 px-4 py-10 md:grid-cols-2 md:gap-4 md:py-6 lg:grid-cols-3'>
        {posts.length > 0 ? (
          posts.map((post) => (
            <IGPost
              key={post.id}
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
          ))
        ) : (
          <>
            {Array.from({ length: 9 }, (v, i) => (
              <LoadingIGPosts key={i} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
