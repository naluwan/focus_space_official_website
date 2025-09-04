import LoginForm from './_components/LoginForm';

const AdminLogin = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 relative'>
      {/* 背景裝飾 */}
      <div className='absolute inset-0 bg-gradient-to-r from-red-600/10 to-yellow-500/10' />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_50%)]' />

      <div className='w-full max-w-md relative z-10'>
        <LoginForm />

        {/* 提示資訊 */}
        <div className='mt-6 text-center'>
          <p className='text-gray-400 text-xs'>
            此為管理員專用登入頁面，請使用管理員帳號登入
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;