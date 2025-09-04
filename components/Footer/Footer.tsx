import Image from 'next/image';
import Link from 'next/link';
import footerIcon from '@/public/footerLogo.png';

const Footer = () => {
  const socialMediaData = [
    {
      title: 'Facebook',
      href: 'https://www.facebook.com/profile.php?id=100088179318429',
      icon: (
        <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
        </svg>
      ),
    },
    {
      title: 'Instagram',
      href: 'https://www.instagram.com/focus.space.banqiao/',
      icon: (
        <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z' />
        </svg>
      ),
    },
    {
      title: 'Line',
      href: 'https://line.me/R/ti/p/@565osqjq?from=page&openQrModal=true&searchId=565osqjq',
      icon: (
        <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M12.017 0C5.396 0 .029 4.285.029 9.567c0 2.637 1.336 4.988 3.43 6.606l.234.153c-.684 2.504-2.25 8.787-2.277 8.942-.034.186.024.384.151.523.128.14.319.22.52.22.034 0 .069-.003.103-.008.442-.067 10.25-1.567 11.787-2.142 4.137-.28 7.22-3.854 7.22-7.997C23.993 4.285 18.627.001 12.017.001zm0 1.5c5.799 0 10.476 3.737 10.476 8.567 0 3.395-2.31 6.388-5.83 7.63-1.297.458-9.27 1.695-10.476 1.96.41-1.545 1.542-5.748 2.085-7.875-.015-.01-.029-.02-.043-.031-1.763-1.352-2.712-3.208-2.712-5.184C1.517 5.238 6.218 1.5 12.017 1.5z' />
        </svg>
      ),
    },
  ];

  const navigationLinks = [
    { name: '首頁', href: '/' },
    { name: '關於我們', href: '/about' },
    { name: '教練介紹', href: '/coach' },
    { name: '課程介紹', href: '/class' },
    { name: '最新消息', href: '/news' },
  ];

  const contactInfo = [
    { label: 'Line', value: '@565osqjq', icon: '📱' },
    { label: 'Email', value: 'focusspace4648@gmail.com', icon: '📧' },
    { label: '地址', value: '新北市板橋區民生路三段30-1號B1', icon: '📍' },
  ];

  return (
    <footer className='relative overflow-hidden bg-gray-900 text-white'>
      {/* 品牌漸層背景 */}
      <div className='absolute inset-0 bg-gradient-to-br from-red-600/15 via-gray-800 to-yellow-500/15' />

      <div className='relative z-10'>
        <div className='max-container px-4 py-12 lg:py-16'>
          {/* 主要內容區域 */}
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12'>
            {/* Logo 與品牌 */}
            <div className='lg:col-span-1'>
              <div className='flex flex-col items-center lg:items-start'>
                <Image
                  src={footerIcon}
                  alt='Focus Space Logo'
                  width={150}
                  height={50}
                  className='mb-4 h-auto w-32 md:w-40'
                  priority
                />
                <h3 className='mb-2 bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-xl font-bold text-transparent'>
                  FOCUS SPACE
                </h3>
                <p className='text-center text-sm leading-relaxed text-gray-400 lg:text-left'>
                  板橋最便利的健身空間
                  <br />
                  專心練，專注你的每一次突破
                </p>
              </div>
            </div>

            {/* 快速導航 */}
            <div className='lg:col-span-1'>
              <h4 className='mb-4 text-lg font-semibold text-left'>
                快速導航
              </h4>
              <nav className='flex flex-col space-y-2'>
                {navigationLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className='py-1 text-left text-gray-400 transition-colors duration-300 hover:bg-gradient-to-r hover:from-red-600 hover:to-yellow-500 hover:bg-clip-text hover:text-transparent hover:text-white'
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* 聯絡資訊 */}
            <div className='lg:col-span-1'>
              <h4 className='mb-4 text-lg font-semibold text-left'>
                聯絡我們
              </h4>
              <div className='space-y-3'>
                {contactInfo.map((info) => (
                  <div
                    key={info.label}
                    className='flex items-center justify-start space-x-3'
                  >
                    <span className='text-lg'>{info.icon}</span>
                    <div>
                      <p className='text-sm text-gray-400'>{info.label}</p>
                      <p className='text-sm font-medium text-white'>{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 社群連結 */}
            <div className='lg:col-span-1'>
              <h4 className='mb-4 text-lg font-semibold text-left'>
                追蹤我們
              </h4>
              <div className='mb-4 flex justify-start space-x-4'>
                {socialMediaData.map((social) => (
                  <a
                    key={social.title}
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='group relative overflow-hidden rounded-full bg-gradient-to-r from-red-600 to-yellow-500 p-[2px] transition-all duration-300 hover:scale-110'
                  >
                    <div className='flex items-center justify-center rounded-full bg-gray-800 p-3 text-white transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-yellow-500'>
                      {social.icon}
                    </div>
                  </a>
                ))}
              </div>
              <p className='text-xs leading-relaxed text-gray-400 text-left'>
                追蹤我們的最新動態
                <br />
                健身知識與活動資訊
              </p>
            </div>
          </div>

          {/* 分隔線 */}
          <div className='mt-8 border-t border-gray-700 pt-6'>
            {/* 版權資訊 */}
            <div className='flex flex-col items-center justify-between space-y-4 text-sm text-gray-400 md:flex-row md:space-y-0'>
              <div className='text-center md:text-left'>
                <p className='mb-1'>© 2023 專心練股份有限公司 版權所有</p>
                <p>Copyright 2023 © FOCUS_SPACE Co. Ltd. All rights reserved.</p>
              </div>
              <div className='text-center md:text-right'>
                <p className='text-xs'>
                  Powered by{' '}
                  <a 
                    href='https://www.triplen.design' 
                    target='_blank' 
                    rel='noopener noreferrer'
                    className='bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text font-medium text-transparent hover:from-red-500 hover:to-yellow-400 transition-all duration-300'
                  >
                    仨恩網頁設計工作室
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
