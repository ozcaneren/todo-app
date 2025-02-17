import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Todo from '@/models/Todo';
import { authenticateUser } from '@/lib/auth';

// Todoları getir
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = await authenticateUser(request);
    
    if (!user || typeof user === 'string' || user instanceof NextResponse) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching todos for user:', user.userId); // Debug log

    const todos = await Todo.find({ userId: user.userId }).sort({ createdAt: -1 });
    
    console.log('Found todos:', todos); // Debug log

    return Response.json(todos);
  } catch (error) {
    console.error('Error in GET /api/todos:', error); // Error log
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Yeni todo oluştur
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const user = await authenticateUser(request);
    
    if (!user || typeof user === 'string' || user instanceof NextResponse) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Received todo data:', body); // Debug log

    const todo = await Todo.create({
      title: body.title,
      category: body.category || 'Genel', // Varsayılan değer ekleyelim
      userId: user.userId,
    });

    console.log('Created todo:', todo); // Debug log
    return Response.json(todo);
  } catch (error) {
    console.error('Error in POST /api/todos:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
