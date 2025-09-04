import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  courseImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const session = await getServerSession(authOptions);

      // If you throw, the user will not be able to upload
      if (!session || ((session.user.role !== 'admin' && session.user.role !== 'superadmin') && session.user.role !== 'superadmin')) {
        throw new Error('Unauthorized');
      }

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id, userRole: session.user.role };
    })
    .onUploadComplete(async () => {
      // This code RUNS ON YOUR SERVER after upload
      // Upload completed successfully
      
      // Do any cleanup or processing here if needed
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;