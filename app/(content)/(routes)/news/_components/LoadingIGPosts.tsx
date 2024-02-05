import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingIGPosts = () => {
  return (
    <Card className='h-auto md:max-h-[500px]'>
      <CardHeader className='md:max-h-[300px]'>
        <Skeleton className='h-[300px] w-full' />
      </CardHeader>
      <CardContent className='h-auto'>
        <div className='flex w-1/2 items-center justify-between pb-2'>
          <Skeleton className='h-4 w-[60px]' />
          <Skeleton className='h-4 w-[80px]' />
        </div>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-[250px]' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingIGPosts;
