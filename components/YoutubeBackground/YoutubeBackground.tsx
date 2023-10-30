const YoutubeBackground = () => {
  return (
    <div className='relative h-screen'>
      <div className='after:bg-[rgba(0, 0, 0, .3)] relative -z-[1] h-full overflow-hidden bg-black after:fixed after:left-0 after:top-0 after:block after:h-full after:w-full after:bg-yt-bg-img after:content-[""]'>
        <iframe
          src='https://www.youtube.com/embed/4-zjQvTDnbw?si=vc3w-6xBQLwdooqp&autoplay=1&controls=0&fs=0&loop=1&disablekb=1&mute=1&playlist=4-zjQvTDnbw'
          title='Youtube background video'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;'
          allowFullScreen
          className='fixed left-[50%] top-[50%] block h-video-height w-video-width -translate-x-1/2 -translate-y-1/2'
        />
      </div>
    </div>
  );
};

export default YoutubeBackground;
