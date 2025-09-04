import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { utapi } from 'uploadthing/server';

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json({ message: 'Image URL is required' }, { status: 400 });
    }

    // 從 URL 中提取文件 key
    const urlParts = imageUrl.split('/');
    const fileKey = urlParts[urlParts.length - 1];
    
    if (!fileKey) {
      return NextResponse.json({ message: 'Invalid image URL' }, { status: 400 });
    }

    // 使用 UploadThing 的 utapi 刪除文件
    await utapi.deleteFiles([fileKey]);

    return NextResponse.json({ 
      message: 'Image deleted successfully',
      deletedKey: fileKey 
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ 
      message: 'Failed to delete image' 
    }, { status: 500 });
  }
}