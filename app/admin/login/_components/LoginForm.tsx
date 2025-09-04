'use client';

import { useState, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // 確保組件已在客戶端掛載
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        setError('帳號或密碼錯誤');
        return;
      }

      // 驗證登入成功
      const session = await getSession();
      if (session) {
        const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';
        router.push(callbackUrl);
      } else {
        setError('登入失敗，請稍後再試');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('登入失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  // 避免水合作用錯誤
  if (!mounted) {
    return (
      <div className='bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-8 space-y-6'>
        <div className='animate-pulse'>
          <div className='h-16 bg-white/10 rounded-full mx-auto mb-4 w-16'></div>
          <div className='h-6 bg-white/10 rounded w-32 mx-auto mb-2'></div>
          <div className='h-4 bg-white/10 rounded w-24 mx-auto'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-8 space-y-6'>
      {/* Logo 區域 */}
      <div className='text-center space-y-4'>
        <div className='flex justify-center'>
          <div className='w-16 h-16 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full flex items-center justify-center'>
            <span className='text-white font-bold text-xl'>FS</span>
          </div>
        </div>
        <div>
          <h1 className='text-2xl font-bold text-white mb-2'>
            Focus Space
          </h1>
          <p className='text-gray-400 text-sm'>
            後台管理系統
          </p>
        </div>
      </div>

      {/* 錯誤訊息 */}
      {error && (
        <div className='bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm text-center'>
          {error}
        </div>
      )}

      {/* 登入表單 */}
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='email' className='block text-sm font-medium text-gray-300 mb-2'>
            管理員帳號
          </label>
          <input
            id='email'
            type='email'
            value={credentials.email}
            onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
            className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all'
            placeholder='請輸入管理員信箱'
            required
            autoComplete='email'
          />
        </div>

        <div>
          <label htmlFor='password' className='block text-sm font-medium text-gray-300 mb-2'>
            密碼
          </label>
          <div className='relative'>
            <input
              id='password'
              type={showPassword ? 'text' : 'password'}
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              className='w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all'
              placeholder='請輸入密碼'
              required
              autoComplete='current-password'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors'
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type='submit'
          disabled={isLoading || !credentials.email || !credentials.password}
          className='w-full py-3 px-4 bg-gradient-to-r from-red-600 to-yellow-500 text-white font-semibold rounded-lg hover:from-red-700 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
        >
          {isLoading ? (
            <div className='flex items-center justify-center'>
              <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2' />
              登入中...
            </div>
          ) : (
            '登入後台'
          )}
        </button>
      </form>

      {/* 底部資訊 */}
      <div className='text-center'>
        <p className='text-xs text-gray-500'>
          © 2024 Focus Space. 版權所有
        </p>
      </div>
    </div>
  );
};

export default LoginForm;