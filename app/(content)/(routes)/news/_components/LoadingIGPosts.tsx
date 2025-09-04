const LoadingIGPosts = () => {
  return (
    <div className='relative overflow-hidden rounded-lg border border-gray-800 bg-gray-900/50 backdrop-blur-sm'>
      {/* 品牌漸層動畫背景 */}
      <div className='absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-yellow-500/5 animate-pulse' />
      
      <div className='relative p-4'>
        {/* 圖片骨架 */}
        <div className='relative h-[300px] w-full overflow-hidden rounded-md bg-gray-800/50'>
          <div className='absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-700/50 to-transparent' />
        </div>
        
        {/* 內容骨架 */}
        <div className='mt-4 space-y-3'>
          {/* 日期和連結 */}
          <div className='flex items-center justify-between'>
            <div className='h-4 w-24 rounded bg-gray-800/50 animate-pulse' />
            <div className='h-4 w-32 rounded bg-gray-800/50 animate-pulse' />
          </div>
          
          {/* 文字內容 */}
          <div className='space-y-2'>
            <div className='h-4 w-full rounded bg-gray-800/50 animate-pulse' />
            <div className='h-4 w-4/5 rounded bg-gray-800/50 animate-pulse' />
            <div className='h-4 w-3/5 rounded bg-gray-800/50 animate-pulse' />
          </div>
          
          {/* 按鈕 */}
          <div className='flex justify-end pt-2'>
            <div className='h-10 w-24 rounded-full bg-gradient-to-r from-red-600/20 to-yellow-500/20 animate-pulse' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIGPosts;