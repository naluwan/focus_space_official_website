import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import Course from '@/models/CourseMongoose';
import { connectToDatabase } from '@/lib/mongodb';
import EditCourseContent from './_components/EditCourseContent';

export const metadata = {
  title: '編輯課程 - Focus Space',
  description: 'Focus Space 編輯課程頁面',
};

interface EditCoursePageProps {
  params: { id: string };
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const session = await getServerSession(authOptions);
  
  // 頁面級別權限檢查
  if (!session || !session.user) {
    redirect('/admin/login');
  }
  
  if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
    redirect('/admin/login?error=insufficient_permissions');
  }
  
  // 確保 MongoDB 連接
  await connectToDatabase();
  
  const course = await Course.findById(params.id);
  
  if (!course) {
    notFound();
  }

  // 將 Mongoose document 轉換為純 JavaScript 物件，避免循環引用
  const courseData = JSON.parse(JSON.stringify(course));

  return <EditCourseContent session={session} course={courseData} />;
}