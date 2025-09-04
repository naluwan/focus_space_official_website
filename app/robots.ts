import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.naluwan.website';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/class',
          '/coach',
          '/news',
          '/booking',
          '/testimonials',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/test-colors',
          '/_next/*',
          '/images/testimonials/*', // 保護會員隱私照片
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/about',
          '/class',
          '/coach', 
          '/news',
          '/booking',
          '/testimonials',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/test-colors',
        ],
      },
      // AI 爬蟲 - ChatGPT
      {
        userAgent: 'GPTBot',
        allow: [
          '/',
          '/about',
          '/class',
          '/coach',
          '/news',
          '/booking',
          '/testimonials',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/test-colors',
          '/images/testimonials/*', // 保護會員隱私
        ],
      },
      // AI 爬蟲 - Google Bard
      {
        userAgent: 'Google-Extended',
        allow: [
          '/',
          '/about',
          '/class',
          '/coach',
          '/news',
          '/booking',
          '/testimonials',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/test-colors',
          '/images/testimonials/*',
        ],
      },
      // AI 爬蟲 - Common Crawl (用於訓練多種 AI)
      {
        userAgent: 'CCBot',
        allow: [
          '/',
          '/about',
          '/class',
          '/coach',
          '/news',
          '/booking',
          '/testimonials',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/test-colors',
          '/images/testimonials/*',
        ],
      },
      // AI 爬蟲 - Claude (Anthropic)
      {
        userAgent: 'Claude-Web',
        allow: [
          '/',
          '/about',
          '/class',
          '/coach',
          '/news',
          '/booking',
          '/testimonials',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/test-colors',
          '/images/testimonials/*',
        ],
      },
      // AI 爬蟲 - ChatGPT 搜尋功能
      {
        userAgent: 'ChatGPT-User',
        allow: [
          '/',
          '/about',
          '/class',
          '/coach',
          '/news',
          '/booking',
          '/testimonials',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/test-colors',
          '/images/testimonials/*',
        ],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}