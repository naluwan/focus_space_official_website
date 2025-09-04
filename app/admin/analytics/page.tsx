import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AnalyticsContent from './_components/AnalyticsContent';

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
    redirect('/admin/login');
  }

  return <AnalyticsContent session={session} />;
}