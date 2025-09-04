import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import AdminLayout from '../_components/AdminLayout';
import TestimonialsContent from './_components/TestimonialsContent';
import { Plus } from 'lucide-react';

export default async function TestimonialsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout session={session}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">會員見證管理</h1>
          <Link
            href="/admin/testimonials/new"
            className="bg-gradient-to-r from-red-600 to-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>新增見證</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <TestimonialsContent />
        </div>
      </main>
    </AdminLayout>
  );
}