/* eslint-disable quotes */
import Navbar from '@/components/Navbar';
import './globals.css';
import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
// import YoutubeBackground from '@/components/YoutubeBackground'; // 保留程式碼作為參考

// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.naluwan.website'),
  title: {
    default: `Focus Space | 專心練 | 健身房 | 運動空間`,
    template: `%s | Focus Space | 專心練`,
  },
  description:
    '板橋市中心最方便親民健身房、運動空間，FOCUS SPACE 專心練，捷運新埔站五號出口，單次入場|分鐘計時|月票季票制，私人課程|團體課程|獨立授課區，場地租借|不綁約制|無需入會費，官方Line @565osqjq',
  icons: {
    icon: '/favicon.io',
  },
  keywords: [
    '新埔站',
    '健身房',
    'focus space',
    'Focus Space',
    'FOCUS SPACE',
    '專心練',
    '運動空間',
    '專心練運動空間',
    '單次',
    '分鐘',
    '月票',
    '計票',
    '私人課程',
    '私課',
    '團體課程',
    '團課',
    '場地租借',
    '租場地',
    '不綁約',
    '無需入會費',
  ],
  // AI 友善的額外 metadata
  authors: [{ name: 'Focus Space Team' }],
  creator: 'Focus Space 專心練',
  publisher: 'Focus Space 專心練',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  // Open Graph 數據（社群分享和 AI 抓取）
  openGraph: {
    title: 'Focus Space | 專心練 | 板橋最親民健身房',
    description:
      '板橋新埔站最親民的健身房，免入會費、不綁約、彈性計費。提供個人訓練、團體課程、場地租借服務。',
    url: 'https://www.naluwan.website',
    siteName: 'Focus Space 專心練',
    locale: 'zh_TW',
    type: 'website',
  },
  // Twitter Card（也被一些 AI 使用）
  twitter: {
    card: 'summary_large_image',
    title: 'Focus Space | 專心練 | 板橋最親民健身房',
    description: '板橋新埔站最親民的健身房，免入會費、不綁約、彈性計費。',
  },
  // 地理位置信息（幫助 AI 理解地點）
  other: {
    'geo.region': 'TW-NTP',
    'geo.placename': '新北市板橋區',
    'geo.position': '25.012346;121.462894',
    ICBM: '25.012346, 121.462894',
    'business-type': 'fitness-center',
    'service-area': '板橋區, 新北市, 台灣',
    'target-audience': '健身愛好者, 上班族, 學生',
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  // 結構化數據 JSON-LD (對 AI 爬蟲非常有用)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://www.naluwan.website/#organization',
    name: 'Focus Space 專心練',
    alternateName: '專心練運動空間',
    description: '板橋新埔站最親民的健身房，免入會費、不綁約、彈性計費制度',
    url: 'https://www.naluwan.website',
    telephone: '02-2258-8228',
    email: 'focusspace4648@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '民生路三段30-1號B1',
      addressLocality: '板橋區',
      addressRegion: '新北市',
      addressCountry: '台灣',
      postalCode: '220',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 25.012346,
      longitude: 121.462894,
    },
    openingHours: 'Mo-Su 07:00-23:00',
    priceRange: '$$',
    paymentAccepted: '現金, 信用卡',
    currenciesAccepted: 'TWD',
    amenityFeature: [
      {
        '@type': 'LocationFeatureSpecification',
        name: '個人訓練',
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: '團體課程',
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: '場地租借',
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: '不綁約制度',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: '健身服務',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '個人訓練課程',
            description: '一對一專業教練指導',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '團體課程',
            description: '多人團體訓練課程',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '單次入場',
            description: '按分鐘計費的彈性使用方案',
          },
        },
      ],
    },
    sameAs: ['https://www.naluwan.website'],
  };

  return (
    <html lang='zh-TW' className='hide-scrollbar'>
      <head>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className='h-auto'>
        <div className='w-full bg-white'>
          <Navbar />
        </div>
        <main className='h-full'>{children}</main>
        <div className='w-full bg-white'>
          <Footer />
        </div>
        <Toaster
          position='top-center'
          reverseOrder={false}
          gutter={8}
          containerClassName=''
          containerStyle={{}}
          toastOptions={{
            className: '',
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
            },
          }}
        />
        {/* <YoutubeBackground /> 保留程式碼作為參考 */}
      </body>
    </html>
  );
};

export default RootLayout;
