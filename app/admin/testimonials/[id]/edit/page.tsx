import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AdminLayout from '../../../_components/AdminLayout';
import EditTestimonialContent from './_components/EditTestimonialContent';

export default async function EditTestimonialPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout session={session} title="編輯會員見證">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-gray-600 mt-2">修改會員訓練成果見證</p>
        </div>
        
        <EditTestimonialContent testimonialId={params.id} />
      </div>
    </AdminLayout>
  );
}