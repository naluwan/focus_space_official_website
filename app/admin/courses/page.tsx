import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CoursesContent from './_components/CoursesContent';

export const metadata = {
  title: '課程管理 - Focus Space',
  description: 'Focus Space 課程管理系統',
};

export default async function CoursesPage() {
  const session = await getServerSession(authOptions);
  
  // 頁面級別權限檢查
  if (!session || !session.user) {
    redirect('/admin/login');
  }
  
  if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
    redirect('/admin/login?error=insufficient_permissions');
  }

  return <CoursesContent session={session} />;
}