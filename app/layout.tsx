import Navbar from '@/components/Navbar';
import './globals.css';
import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
import Footer from '@/components/Footer';
import YoutubeBackground from '@/components/YoutubeBackground';

// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Focus Space | 專心練 &nbsp;|&nbsp; 健身房 &nbsp;| 運動空間',
    template: '%s &nbsp;| Focus Space | 專心練',
  },
  description:
    '板橋市中心最方便親民健身房、運動空間，FOCUS SPACE 專心練，捷運新埔站五號出口，單次入場|分鐘計時|月票季票制，私人課程|團體課程|獨立授課區，場地租借|不綁約制|無需入會費，官方Line @565osqjq',
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
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='zh-TW'>
      <body className='hide-scrollbar h-auto'>
        <div className='w-full bg-white'>
          <Navbar />
        </div>
        <main className='h-full'>{children}</main>
        <div className='w-full bg-white'>
          <Footer />
        </div>
        <YoutubeBackground />
      </body>
    </html>
  );
};

export default RootLayout;
