import { NextResponse } from 'next/server';
import axios from 'axios';

// 設定路由的執行時間限制
export const maxDuration = 30; // 30 秒

export async function GET(request: Request) {
  try {
    // 驗證請求來源（可選）
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.API_SECRET;
    
    // 如果設定了 API_SECRET，則需要驗證
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 從環境變數獲取 IG Token（不再使用 NEXT_PUBLIC_ 前綴）
    const IG_TOKEN = process.env.IG_TOKEN;

    if (!IG_TOKEN) {
      console.error('[Refresh IG Token] Missing IG_TOKEN environment variable');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // 呼叫 Instagram API 更新 token
    const response = await axios.get('https://graph.instagram.com/refresh_access_token', {
      params: {
        grant_type: 'ig_refresh_token',
        access_token: IG_TOKEN,
      },
    });

    const { access_token, expires_in } = response.data;

    // 計算過期時間
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    console.log('[Refresh IG Token] Token refreshed successfully', {
      expiresIn: expires_in,
      expiresAt: expiresAt.toISOString(),
    });

    // 返回成功響應
    return NextResponse.json({
      success: true,
      message: 'IG token refreshed successfully',
      accessToken: access_token,
      expiresIn: expires_in,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('[Refresh IG Token] API Error:', {
        status: error.response?.status,
        message: error.response?.data?.error?.message || error.message,
      });

      // 特定錯誤處理
      if (error.response?.status === 400) {
        return NextResponse.json(
          { error: 'Invalid token or token expired' },
          { status: 400 }
        );
      }
    } else {
      console.error('[Refresh IG Token] Unexpected error:', error);
    }

    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}

// POST 方法：手動觸發 token 更新（需要認證）
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { secret } = body;

    // 驗證 API Secret
    const apiSecret = process.env.API_SECRET;
    if (!apiSecret || secret !== apiSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 呼叫 GET 方法執行實際的更新
    return GET(request);
  } catch (error) {
    console.error('[Refresh IG Token] POST handler error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}