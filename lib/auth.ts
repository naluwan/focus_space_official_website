import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import AdminModel from '@/models/Admin';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('請輸入帳號和密碼');
        }

        try {
          // 初始化預設管理員帳號（首次使用時）
          await AdminModel.initializeDefaultAdmin();

          // 查找管理員
          const admin = await AdminModel.findByEmail(credentials.email);

          if (!admin) {
            throw new Error('帳號或密碼錯誤');
          }

          // 驗證密碼
          const isValid = await AdminModel.validatePassword(
            credentials.password,
            admin.password
          );

          if (!isValid) {
            throw new Error('帳號或密碼錯誤');
          }

          // 返回用戶資料（不包含密碼）
          return {
            id: admin._id!,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          };
        } catch (error) {
          throw new Error('登入失敗，請稍後再試');
        }
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as string,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'focus-space-admin-secret-key-2024',
};