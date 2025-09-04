import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardContent from './_components/DashboardContent';

export const metadata = {
  title: '後台管理 - Focus Space',
  description: 'Focus Space 後台管理系統主控台',
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  // 頁面級別權限檢查
  if (!session || !session.user) {
    redirect('/admin/login');
  }
  
  if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
    redirect('/admin/login?error=insufficient_permissions');
  }

  return <DashboardContent session={session} />;
}