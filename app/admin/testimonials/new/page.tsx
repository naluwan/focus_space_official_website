import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import AdminLayout from '../../_components/AdminLayout';
import NewTestimonialContent from './_components/NewTestimonialContent';

export default async function NewTestimonialPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout session={session}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/admin/testimonials" 
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            ← 返回見證列表
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">新增會員見證</h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <NewTestimonialContent />
        </div>
      </main>
    </AdminLayout>
  );
}