// import { Card, CardContent, CardHeader } from '@/components/ui/card';
// import { Skeleton } from '@/components/ui/skeleton';

const LoadingIGPosts = () => {
  return (
    // <Card className='h-auto md:max-h-[500px]'>
    //   <CardHeader className='md:max-h-[300px]'>
    //     <Skeleton className='h-[300px] w-full' />
    //   </CardHeader>
    //   <CardContent className='h-auto'>
    //     <div className='flex w-1/2 items-center justify-between pb-2'>
    //       <Skeleton className='h-4 w-[60px]' />
    //       <Skeleton className='h-4 w-[80px]' />
    //     </div>
    //     <div className='space-y-2'>
    //       <Skeleton className='h-4 w-[250px]' />
    //       <Skeleton className='h-4 w-[200px]' />
    //     </div>
    //   </CardContent>
    // </Card>
    <div className='relative flex flex-col items-center justify-center overflow-hidden bg-black'>
      <div className='absolute inset-0 bg-[url(/img/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]'></div>

      <div className='h-auto w-full md:max-h-[500px]'>
        <div className='relative w-full space-y-5 overflow-hidden rounded-2xl bg-white/5 p-4 shadow-xl shadow-black/5 before:absolute before:inset-0 before:-translate-x-full before:-skew-x-12 before:animate-[shimmer_2s_infinite] before:border-t before:border-white/10 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent'>
          <div className='h-[300px] rounded-lg bg-white/5'></div>
          <div className='space-y-3'>
            <div className='h-5 w-3/5 rounded-lg bg-white/5'></div>
            <div className='h-5 w-4/5 rounded-lg bg-white/10'></div>
            <div className='h-5 w-2/5 rounded-lg bg-white/5'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIGPosts;
