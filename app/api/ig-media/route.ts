import { NextRequest, NextResponse } from 'next/server';

// 只允許代理 Instagram / Facebook CDN 的媒體,避免被當成開放代理濫用
const ALLOWED_HOST_SUFFIXES = ['cdninstagram.com', 'fbcdn.net'];

function isAllowedHost(hostname: string): boolean {
  return ALLOWED_HOST_SUFFIXES.some(
    (suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`),
  );
}

// GET 方法:代理 Instagram CDN 影片,解決行動裝置瀏覽器直接載入 IG CDN 影片被拒的問題
export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get('url');
  if (!target) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(target);
  } catch {
    return new NextResponse('Invalid url', { status: 400 });
  }

  if (parsedUrl.protocol !== 'https:' || !isAllowedHost(parsedUrl.hostname)) {
    return new NextResponse('Forbidden host', { status: 403 });
  }

  try {
    // 轉發 Range 標頭,讓影片支援拖曳進度條與 iOS Safari 的分段請求
    const upstreamHeaders: Record<string, string> = {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
    };
    const range = request.headers.get('range');
    if (range) {
      upstreamHeaders['Range'] = range;
    }

    const upstream = await fetch(parsedUrl.toString(), {
      headers: upstreamHeaders,
    });

    if (!upstream.ok && upstream.status !== 206) {
      console.error(
        `[IG Media Proxy] Upstream error ${upstream.status} for ${parsedUrl.hostname}`,
      );
      return new NextResponse('Upstream fetch failed', { status: 502 });
    }

    const responseHeaders = new Headers();
    const passThroughHeaders = [
      'content-type',
      'content-length',
      'content-range',
      'accept-ranges',
    ];
    passThroughHeaders.forEach((header) => {
      const value = upstream.headers.get(header);
      if (value) responseHeaders.set(header, value);
    });
    responseHeaders.set('Cache-Control', 'public, max-age=3600');

    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[IG Media Proxy] Error fetching media:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
