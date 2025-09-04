import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AdminLayout from '../../_components/AdminLayout';
import CourseDetailContent from './_components/CourseDetailContent';

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout session={session}>
      <div className="container mx-auto px-4 py-8">
        <CourseDetailContent courseId={params.id} />
      </div>
    </AdminLayout>
  );
}