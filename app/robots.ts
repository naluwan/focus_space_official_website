import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: [
      'https://www.naluwan.website/sitemap.xml',
      'https://www.naluwan.website/sitemap2.xml',
    ],
  };
}
