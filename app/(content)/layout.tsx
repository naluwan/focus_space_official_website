import React from 'react';

const ContentLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className='h-auto w-full bg-black'>{children}</div>;
};

export default ContentLayout;
