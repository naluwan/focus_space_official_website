import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AdminLayout from '../../_components/AdminLayout';
import TestimonialDetailContent from './_components/TestimonialDetailContent';

export default async function TestimonialDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout session={session}>
      <div className="container mx-auto px-4 py-8">
        <TestimonialDetailContent testimonialId={params.id} />
      </div>
    </AdminLayout>
  );
}