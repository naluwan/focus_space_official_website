import { ArrowUpFromLine } from 'lucide-react';

const ScrollToTop = () => {
  return (
    <button
      className='sticky bottom-5 left-[95%] flex items-center justify-center rounded-full bg-[#FFD531] p-3'
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }
    >
      <ArrowUpFromLine className='h-8 w-8' />
    </button>
  );
};

export default ScrollToTop;
