'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import TodoList from '@/components/todos/TodoList';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, router, loading]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">Yükleniyor...</div>
    </div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4">
      <TodoList />
    </div>
  );
}
