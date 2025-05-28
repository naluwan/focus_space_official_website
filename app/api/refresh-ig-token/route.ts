import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const IG_TOKEN = process.env.NEXT_PUBLIC_IG_TOKEN;

    if (!IG_TOKEN) {
      return NextResponse.json({ error: '缺少 IG Token' }, { status: 400 });
    }

    const refresh = await axios.get('https://graph.instagram.com/refresh_access_token', {
      params: {
        grant_type: 'ig_refresh_token',
        access_token: IG_TOKEN,
      },
    });

    const { expires_in } = refresh.data;

    // 📌 注意：access_token 是與原本相同的，只是續期了
    // ✅ 你可以選擇寫入資料庫儲存，或者 log 供確認用
    // console.log('✅ IG Token refreshed:', { access_token, expires_in });

    return NextResponse.json({
      message: 'IG token refreshed successfully',
      expiresIn: expires_in,
    });
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error('❌ IG token refresh error:', err.response?.data || err.message);
    } else {
      console.error('❌ Unexpected error:', err);
    }
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}
