import SessionProvider from '@/components/providers/SessionProvider';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import './admin.css';

export const metadata = {
  title: 'Focus Space 後台管理系統',
  description: 'Focus Space 官網內容管理後台',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <SessionProvider session={session}>
      <div className='min-h-screen bg-gray-900 text-white antialiased'>
        {children}
      </div>
    </SessionProvider>
  );
}