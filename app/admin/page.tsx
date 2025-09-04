import { redirect } from 'next/navigation';

export default function AdminPage() {
  // 自動重定向到 dashboard
  redirect('/admin/dashboard');
}