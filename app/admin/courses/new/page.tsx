import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import NewCourseContent from './_components/NewCourseContent';

export const metadata = {
  title: '新增課程 - Focus Space',
  description: 'Focus Space 新增課程頁面',
};

export default async function NewCoursePage() {
  const session = await getServerSession(authOptions);
  
  // 頁面級別權限檢查
  if (!session || !session.user) {
    redirect('/admin/login');
  }
  
  if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
    redirect('/admin/login?error=insufficient_permissions');
  }

  return <NewCourseContent session={session} />;
}