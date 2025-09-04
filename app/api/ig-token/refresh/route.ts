import { NextResponse } from 'next/server';
import axios from 'axios';

/**
 * 自動刷新長期 Instagram Access Token
 * 長期 token 可以在到期前刷新，延長 60 天
 */

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    // 驗證 API Secret
    const body = await request.json();
    const { secret } = body;

    const apiSecret = process.env.API_SECRET;
    if (!apiSecret || secret !== apiSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const currentToken = process.env.IG_TOKEN;
    if (!currentToken) {
      return NextResponse.json(
        { error: 'IG_TOKEN not found in environment variables' },
        { status: 500 }
      );
    }

    console.log('[IG Token Refresh] Starting token refresh...');

    // 刷新長期 token
    const response = await axios.get('https://graph.instagram.com/refresh_access_token', {
      params: {
        grant_type: 'ig_refresh_token',
        access_token: currentToken,
      },
    });

    const { access_token, expires_in } = response.data;
    const expiryDate = new Date(Date.now() + expires_in * 1000);
    const daysLeft = Math.floor(expires_in / (24 * 60 * 60));

    console.log('[IG Token Refresh] Success:', {
      expiresIn: expires_in,
      daysLeft,
      expiryDate: expiryDate.toISOString(),
    });

    // 檢查 token 是否有變化（通常會是相同的）
    const tokenChanged = access_token !== currentToken;

    return NextResponse.json({
      success: true,
      message: 'Token refreshed successfully',
      tokenChanged,
      newToken: tokenChanged ? access_token : undefined,
      expiresIn: expires_in,
      expiresInDays: daysLeft,
      expiryDate: expiryDate.toISOString(),
      recommendation: daysLeft < 10 
        ? 'Token expires soon, consider manual renewal' 
        : 'Token is healthy'
    });

  } catch (error) {
    console.error('[IG Token Refresh] Error:', error);

    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      
      if (status === 400) {
        return NextResponse.json({
          error: 'Token refresh failed',
          details: data?.error?.message || 'Invalid or expired token',
          recommendation: 'Generate a new long-lived token manually'
        }, { status: 400 });
      }
    }

    return NextResponse.json({
      error: 'Internal server error during token refresh'
    }, { status: 500 });
  }
}

// GET: 檢查當前 token 狀態
export async function GET() {
  try {
    // 簡單的 token 狀態檢查（不需要認證）
    const currentToken = process.env.IG_TOKEN;
    if (!currentToken) {
      return NextResponse.json({
        error: 'No IG_TOKEN configured'
      }, { status: 500 });
    }

    // 嘗試簡單的 API 呼叫來檢查 token 狀態
    const response = await axios.get('https://graph.instagram.com/me', {
      params: {
        fields: 'id,username',
        access_token: currentToken,
      },
    });

    return NextResponse.json({
      status: 'healthy',
      user: response.data,
      message: 'Token is working properly'
    });

  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      
      return NextResponse.json({
        status: 'unhealthy',
        error: data?.error?.message || 'Token validation failed',
        httpStatus: status,
        recommendation: status === 400 
          ? 'Token may be expired or invalid' 
          : 'Check token permissions'
      });
    }

    return NextResponse.json({
      status: 'error',
      error: 'Unable to validate token'
    }, { status: 500 });
  }
}