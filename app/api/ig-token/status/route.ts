import { NextResponse } from 'next/server';
import { getTokenManager } from '@/lib/token-manager';

/**
 * 獲取 Instagram Token 狀態資訊
 */
export async function GET() {
  try {
    const tokenManager = getTokenManager();
    const status = tokenManager.getTokenStatus();
    
    return NextResponse.json({
      success: true,
      ...status,
      message: status.isExpiringSoon 
        ? 'Token is expiring soon and will be refreshed automatically'
        : 'Token is healthy'
    });
    
  } catch (error) {
    console.error('[IG Token Status] Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to get token status'
    }, { status: 500 });
  }
}

/**
 * 手動觸發 Token 刷新
 */
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

    const tokenManager = getTokenManager();
    const result = await tokenManager.autoRefreshToken();
    
    const status = tokenManager.getTokenStatus();
    
    return NextResponse.json({
      refreshResult: result,
      tokenStatus: status
    });
    
  } catch (error) {
    console.error('[IG Token Status] Manual refresh error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to refresh token'
    }, { status: 500 });
  }
}