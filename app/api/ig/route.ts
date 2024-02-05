import axios from 'axios';
import { NextResponse } from 'next/server';

export interface PostType {
  caption?: string;
  media_url: string;
  timestamp: string;
  id: string;
  permalink: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  thumbnail_url?: string;
  children?: { data: { id: string; media_type: 'IMAGE' | 'VIDEO'; media_url: string }[] };
  carouselAlbum?: {
    data: { id: string; media_type: 'IMAGE' | 'VIDEO'; media_url: string }[];
  };
  postTime: number;
  isTop: boolean;
}

export async function POST(req: Request) {
  try {
    const { secret } = await req.json();

    if (secret !== process.env.NEXT_PUBLIC_API_SECRET) {
      return new NextResponse('驗證錯誤', { status: 401 });
    }

    // 刷新token
    const refreshToken = await axios.get(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${process.env.NEXT_PUBLIC_IG_TOKEN}`,
    );

    // 獲得新token
    const {
      data: { access_token },
    } = refreshToken;

    // 獲取ig 文章
    const data = await axios.get(
      'https://graph.instagram.com/me/media?fields=id,caption,media_url,timestamp,permalink,media_type,thumbnail_url,children{media_url,thumbnail_url,media_type}&limit=100',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    const topPosts: PostType[] = [];
    let currentPosts: PostType[] = [];

    // 篩選是否有置頂文章
    data.data.data.forEach((item: PostType) => {
      item.postTime = Date.parse(item.timestamp);
      if (item.children) {
        item.carouselAlbum = item.children;
        delete item.children;
      }
      if (item.caption) {
        if (item.caption.includes('#置頂')) {
          item.isTop = true;
          topPosts.push(item);
        } else if (currentPosts.length < 9) {
          item.isTop = false;
          currentPosts.push(item);
        }
      }
    });

    if (topPosts.length) {
      currentPosts.splice(9 - topPosts.length, topPosts.length);
      currentPosts = topPosts
        .sort((a, b) => b.postTime - a.postTime)
        .concat(currentPosts);
    }

    return NextResponse.json(currentPosts);
  } catch (err) {
    console.log('[CONNECT IG]', err);
    return new NextResponse('伺服器錯誤', { status: 500 });
  }
}
