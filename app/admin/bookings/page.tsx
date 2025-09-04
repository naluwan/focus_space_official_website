import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import BookingsContent from './_components/BookingsContent';
import { authOptions } from '@/lib/auth';

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
    redirect('/admin/login');
  }

  return <BookingsContent session={session} />;
}