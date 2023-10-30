import Image from 'next/image';

const Footer = () => {
  return (
    <div className='max-container padding-container h-auto bg-white py-4 text-black'>
      <div className='flex justify-evenly max-md:flex-col max-md:items-center'>
        <Image
          src='/footerLogo.png'
          alt='footer logo'
          width={180}
          height={60}
          className='h-auto w-auto'
          priority
        />
        <div className='flex flex-col items-center justify-center p-4'>
          <h1 className='text-4xl tracking-wide max-md:text-2xl'>聯絡我們</h1>
          <div className='max-md:text-xs'>
            <p>自由教練場租/個人專項教練/團體課程等任何問題</p>
            <p>可私訊Focus_Space粉絲專頁或E-mail，我們將盡快回覆</p>
            <p>Focus_Space 官方Line：@565osqjq</p>
            <p>Focus_Space E-mail：focusspace4648@gmail.com</p>
          </div>
        </div>
      </div>
      <div className='flex flex-col items-center justify-center p-4 text-sm max-md:text-[10px]'>
        <p className='m-0'>專心練股份有限公司 版權所有</p>
        <p className='m-0'>Copyright 2023 © FOCUS_SPACE Co. Ltd. All rights reserved.</p>
        <p className='m-0'>Powered by NaLuWan</p>
      </div>
    </div>
  );
};

export default Footer;
