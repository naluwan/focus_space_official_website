'use client';

import AdminSidebar from './AdminSidebar';

interface AdminSession {
  user?: {
    name?: string | null;
    email?: string | null;
    id?: string;
  };
  expires: string;
}

interface AdminLayoutProps {
  children: React.ReactNode;
  session: AdminSession;
  title?: string;
}

const AdminLayout = ({ children, session, title }: AdminLayoutProps) => {
  return (
    <div className='flex h-screen bg-gray-900'>
      <AdminSidebar session={session} />
      
      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden lg:ml-0'>
        {/* Header */}
        {title && (
          <header className='bg-white border-b border-gray-200 px-6 py-4'>
            <h1 className='text-2xl font-bold text-gray-900'>{title}</h1>
          </header>
        )}
        
        {/* Content */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-50'>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;