const Hero = () => {
  return (
    <div className='h-full p-6 text-white'>
      <div className='flex h-full flex-col justify-evenly font-bebas_neue text-9xl max-md:items-center max-md:text-6xl'>
        <h1>
          <span className='text-gradient-color bg-gradient-to-r from-red-600 from-15% to-yellow-500 to-90% text-transparent'>
            Focus
          </span>{' '}
          On
        </h1>
        <div className='flex justify-center'>
          <h1>Your Own</h1>
        </div>
        <div className='flex justify-end'>
          <h1>
            Training{' '}
            <span className='text-gradient-color bg-gradient-to-r from-yellow-500 from-15% to-red-600 to-90% text-transparent'>
              Space
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Hero;
