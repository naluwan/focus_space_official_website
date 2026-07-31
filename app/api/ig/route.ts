import axios from 'axios';
import { NextResponse } from 'next/server';
import { getTokenManager } from '@/lib/token-manager';

export interface PostType {
  caption?: string;
  // IG API 對部分影片(如 Reels)不會回傳 media_url
  media_url?: string;
  timestamp: string;
  id: string;
  permalink: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  thumbnail_url?: string;
  children?: {
    data: {
      id: string;
      media_type: 'IMAGE' | 'VIDEO';
      media_url: string;
      thumbnail_url: string;
    }[];
  };
  carouselAlbum?: {
    data: {
      id: string;
      media_type: 'IMAGE' | 'VIDEO';
      media_url: string;
      thumbnail_url: string;
    }[];
  };
  postTime: number;
  isTop: boolean;
}

// 簡單的記憶體快取
interface CacheEntry {
  data: PostType[];
  timestamp: number;
}

let cache: CacheEntry | null = null;
const CACHE_TTL = 3600000; // 1 小時的快取時間 (毫秒)

// 驗證請求來源
function validateRequest(request: Request): boolean {
  // 檢查是否為同源請求
  const origin = request.headers.get('origin');
  
  // 在生產環境中，應該檢查特定的域名
  if (process.env.NODE_ENV === 'production') {
    const allowedOrigins = [
      'https://focusspace.tw',
      'https://www.focusspace.tw',
      // 添加其他允許的域名
    ];
    
    if (origin && !allowedOrigins.includes(origin)) {
      return false;
    }
  }
  
  return true;
}

// GET 方法：獲取 Instagram 貼文（公開接口）
export async function GET(request: Request) {
  try {
    // 驗證請求來源
    if (!validateRequest(request)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 🔄 智能自動刷新 Token（每次 API 呼叫時檢查）
    const tokenManager = getTokenManager();
    let tokenRefreshResult = null;
    
    try {
      tokenRefreshResult = await tokenManager.autoRefreshToken();
      if (tokenRefreshResult.success) {
        if (tokenRefreshResult.newToken) {
          console.warn('[IG API] ⚠️ Token updated but requires manual env update:', tokenRefreshResult.message);
        } else {
          console.log('[IG API] Token status:', tokenRefreshResult.message);
        }
      } else {
        console.error('[IG API] Token refresh failed:', tokenRefreshResult.message);
      }
    } catch (refreshError) {
      console.error('[IG API] Token refresh error:', refreshError);
      // 繼續執行，使用現有 Token
    }

    // 檢查快取
    if (cache && (Date.now() - cache.timestamp < CACHE_TTL)) {
      const cachedResponse = NextResponse.json({
        posts: cache.data,
        cached: true,
        cacheAge: Math.floor((Date.now() - cache.timestamp) / 1000), // 秒
      });
      
      // 如果 Token 刷新成功，加入 header
      if (tokenRefreshResult?.success) {
        cachedResponse.headers.set('X-Token-Refreshed', 'true');
        cachedResponse.headers.set('X-Token-Message', tokenRefreshResult.message);
      }
      
      return cachedResponse;
    }

    // 確保環境變數存在
    const igToken = process.env.IG_TOKEN;
    if (!igToken) {
      console.error('[IG API] Missing IG_TOKEN environment variable');
      return new NextResponse('Server configuration error', { status: 500 });
    }

    // 獲取 Instagram 文章
    const igResponse = await axios.get(
      'https://graph.instagram.com/me/media',
      {
        params: {
          fields: 'id,caption,media_url,timestamp,permalink,media_type,thumbnail_url,children{media_url,thumbnail_url,media_type}',
          limit: 100,
          access_token: igToken,
        },
      },
    );

    const topPosts: PostType[] = [];
    let currentPosts: PostType[] = [];

    // 篩選是否有置頂文章
    igResponse.data.data.forEach((item: PostType) => {
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

    // 更新快取
    cache = {
      data: currentPosts,
      timestamp: Date.now(),
    };

    const jsonResponse = NextResponse.json({
      posts: currentPosts,
      cached: false,
    });

    // 如果 Token 刷新成功，加入 header
    if (tokenRefreshResult?.success) {
      jsonResponse.headers.set('X-Token-Refreshed', 'true');
      jsonResponse.headers.set('X-Token-Message', tokenRefreshResult.message);
    }

    return jsonResponse;
  } catch (error) {
    console.error('[IG API] Error fetching posts:', error);
    
    // 檢查是否為 token 相關錯誤
    let errorMessage = 'Failed to fetch Instagram posts';
    let shouldReturnCache = true;
    
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      if (status === 400 && errorData?.error) {
        const errorType = errorData.error.type;
        const errorMsg = errorData.error.message;
        
        if (errorMsg?.includes('decrypt') || errorMsg?.includes('token')) {
          errorMessage = 'Instagram token has expired. Please update the token.';
          shouldReturnCache = false; // 不返回可能過時的快取
          
          // 記錄詳細的 token 錯誤
          console.error('[IG API] Token Error Details:', {
            type: errorType,
            message: errorMsg,
            suggestion: 'Update IG_TOKEN in environment variables'
          });
        }
      }
    }
    
    // 如果有快取且不是 token 錯誤，返回快取數據
    if (cache && shouldReturnCache) {
      console.warn('[IG API] Returning stale cache due to API error');
      return NextResponse.json({
        posts: cache.data,
        cached: true,
        cacheAge: Math.floor((Date.now() - cache.timestamp) / 1000),
        stale: true,
        error: 'API temporarily unavailable, showing cached content',
      });
    }
    
    // Token 錯誤或無快取時返回錯誤
    return new NextResponse(errorMessage, { 
      status: (axios.isAxiosError(error) && error.response ? error.response.status : 500),
      headers: {
        'X-Error-Type': 'instagram-api-error',
        'X-Error-Details': errorMessage,
      }
    });
  }
}

// POST 方法：強制刷新快取（需要認證）
export async function POST(request: Request) {
  try {
    // 從請求體獲取認證資訊
    const body = await request.json();
    const { secret } = body;

    // 驗證 API Secret
    const apiSecret = process.env.API_SECRET;
    if (!apiSecret || secret !== apiSecret) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 清除快取
    cache = null;

    // 重新獲取資料
    return GET(request);
  } catch (error) {
    console.error('[IG API] Error in POST handler:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// 新增：獲取 API 健康狀態
export async function HEAD() {
  const status = {
    healthy: true,
    cacheActive: cache !== null,
    cacheAge: cache ? Math.floor((Date.now() - cache.timestamp) / 1000) : null,
  };
  
  return new NextResponse(null, {
    status: 200,
    headers: {
      'X-Cache-Active': String(status.cacheActive),
      'X-Cache-Age': String(status.cacheAge || 0),
    },
  });
}