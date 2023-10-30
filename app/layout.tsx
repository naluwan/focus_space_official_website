import Navbar from '@/components/Navbar';
import './globals.css';
import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
import Footer from '@/components/Footer';
import YoutubeBackground from '@/components/YoutubeBackground';

// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '專心練運動空間',
  description:
    '板橋市中心最方便親民健身房，捷運新埔站五號出口，單次入場|分鐘計時|月票季票制，私人課程|團體課程|獨立授課區，場地租借|不綁約制|無需入會費，官方Line @565osqjq',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='zh-TW'>
      <body className='h-auto'>
        <div className='w-full bg-white'>
          <Navbar />
        </div>
        <main className='h-full'>{children}</main>
        <Footer />
        <YoutubeBackground />
      </body>
    </html>
  );
};

export default RootLayout;
