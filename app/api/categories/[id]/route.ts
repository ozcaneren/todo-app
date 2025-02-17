import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import { authenticateUser } from '@/lib/auth';

interface Props {
  params: { id: string }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    await connectDB();
    const user = await authenticateUser(request);
    
    if (!user || typeof user === 'string' || user instanceof Response) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    await Category.findOneAndDelete({ _id: id, userId: user.userId });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/categories:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
} 