import React from 'react';
import './index.css';

interface IVideoPlayerProps {
  options: {
    sources?: { src: string; type: string }[];
    poster?: string;
    autoplay?: boolean;
  };
  id: string;
}

const VideoPlayer: React.FC<IVideoPlayerProps> = ({ options, id }) => {
  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className='flex h-full min-h-[200px] items-center justify-center bg-gray-900 text-white rounded-lg'>
        <div className='text-center p-4'>
          <div className='mb-4'>
            <svg className='mx-auto h-12 w-12 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' />
            </svg>
          </div>
          <p className='text-sm text-gray-400 mb-1'>影片無法載入</p>
          <p className='text-xs text-gray-500'>請直接到 Instagram 觀看</p>
        </div>
      </div>
    );
  }

  return (
    <div className='relative h-full'>
      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg z-10'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2'></div>
            <p className='text-sm text-gray-400'>載入中...</p>
          </div>
        </div>
      )}
      <video
        key={id}
        className='w-full h-full object-cover rounded-lg'
        controls
        playsInline
        preload='metadata'
        poster={options.poster}
        autoPlay={options.autoplay}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onError={handleError}
        crossOrigin="anonymous"
      >
        {options.sources?.map((source, index) => (
          <source key={index} src={source.src} type={source.type} />
        ))}
        <track kind='captions' />
      </video>
    </div>
  );
};

export default VideoPlayer;