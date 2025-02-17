import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Todo from '@/models/Todo';
import { authenticateUser } from '@/lib/auth';

type Props = {
  params: {
    id: string;
  };
};

// Todo güncelle
export async function PUT(req: NextRequest, { params }: Props) {
  try {
    await connectDB();
    const user = await authenticateUser(req);
    const { id } = await params;

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const todo = await Todo.findByIdAndUpdate(id, data, { new: true });

    return Response.json(todo);
  } catch (error) {
    console.error('Todo update error:', error);
    return Response.json({ error: 'Error updating todo' }, { status: 500 });
  }
}

// Todo sil
export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    await connectDB();
    const user = await authenticateUser(req);
    const { id } = await params;

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await Todo.findByIdAndDelete(id);
    return Response.json({ message: 'Todo deleted' });
  } catch (error) {
    console.error('Todo delete error:', error);
    return Response.json({ error: 'Error deleting todo' }, { status: 500 });
  }
} 