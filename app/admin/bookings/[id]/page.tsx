import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import BookingDetailContent from './_components/BookingDetailContent';

export const metadata = {
  title: '預約詳情 - Focus Space',
  description: 'Focus Space 預約詳情管理',
};

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  // 頁面級別權限檢查
  if (!session || !session.user) {
    redirect('/admin/login');
  }
  
  if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
    redirect('/admin/login?error=insufficient_permissions');
  }

  return <BookingDetailContent session={session} bookingId={params.id} />;
}