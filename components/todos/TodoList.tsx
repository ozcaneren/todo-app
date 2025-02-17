'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import TodoItem from './TodoItem';
import AddTodo from './AddTodo';
import CategoryManager from '../categories/CategoryManager';

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  name: string;
  userId: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Filtreleme state'leri
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [hideCompleted, setHideCompleted] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showStats, setShowStats] = useState<boolean>(false);

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch categories');

      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  const addCategory = async (name: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error('Failed to add category');

      const newCategory = await res.json();
      setCategories([...categories, newCategory]);
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Kategori eklenirken bir hata oluştu');
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete category');

      setCategories(categories.filter(cat => cat._id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Kategori silinirken bir hata oluştu');
    }
  };

  const fetchTodos = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/todos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch todos');
      }

      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchTodos();
      fetchCategories();
    }
  }, [fetchTodos, fetchCategories, user, router, authLoading]);

  const addTodo = async (title: string, category: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          title, 
          category 
        }),
      });

      if (!res.ok) throw new Error('Failed to add todo');

      const newTodo = await res.json();
      setTodos([newTodo, ...todos]);
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Todo eklenirken bir hata oluştu');
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed }),
      });

      if (!res.ok) throw new Error('Failed to update todo');

      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...todo, completed } : todo
        )
      );
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete todo');

      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const editTodo = async (id: string, newTitle: string, newCategory: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          title: newTitle, 
          category: newCategory,
          completed: todos.find(t => t._id === id)?.completed || false
        }),
      });

      if (!res.ok) throw new Error('Failed to update todo');

      const updatedTodo = await res.json();
      setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo));
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Todo güncellenirken bir hata oluştu');
    }
  };

  // Filtrelenmiş todoları hesapla
  const filteredTodos = todos.filter(todo => {
    const matchesCategory = !selectedCategory || todo.category === selectedCategory;
    const matchesCompletion = !hideCompleted || !todo.completed;
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesCompletion && matchesSearch;
  });

  if (authLoading || loading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  return (
    <div className="">
      {/* Filtreleme Arayüzü */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border border-gray-300 bg-input rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hideCompleted"
                checked={hideCompleted}
                onChange={(e) => setHideCompleted(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <label htmlFor="hideCompleted" className="text-sm text-gray-100 font-medium">
                Tamamlananları Gizle
              </label>
            </div>

            <button
              onClick={() => setShowStats(!showStats)}
              className={`flex items-center gap-1 px-3 py-3.5 text-sm rounded-lg transition-colors ${
                showStats 
                ? 'bg-white text-button hover:text-white hover:bg-button'
                : 'bg-button text-white hover:bg-buttonHover' 
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              İstatistikler
            </button>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Görev ara..."
            className="flex-1 p-2 border border-gray-300 text-black bg-input rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* İstatistikler (Koşullu Render) */}
      {showStats && (
        <div className="mb-6 p-4 bg-primary rounded-lg shadow text-black">
          <h3 className="text-lg font-semibold mb-2">İstatistikler</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Toplam Görev</p>
              <p className="text-xl font-bold">{todos.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tamamlanan</p>
              <p className="text-xl font-bold">{todos.filter(t => t.completed).length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Aktif</p>
              <p className="text-xl font-bold">{todos.filter(t => !t.completed).length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Kategoriler</p>
              <p className="text-xl font-bold">{categories.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Kategori Yönetimi */}
      <CategoryManager
        categories={categories}
        onCategoryAdd={addCategory}
        onCategoryDelete={deleteCategory}
      />

      {/* Todo Ekleme Formu */}
      <AddTodo onAdd={addTodo} categories={categories} />

      {/* Todo Listesi */}
      {loading ? (
        <div className="text-center">Yükleniyor...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : filteredTodos.length === 0 ? (
        <div className="text-center text-gray-500">Görev bulunamadı</div>
      ) : (
        <div className="space-y-4">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo._id}
              id={todo._id}
              title={todo.title}
              completed={todo.completed}
              category={todo.category}
              categories={categories}
              createdAt={todo.createdAt}
              updatedAt={todo.updatedAt}
              onDelete={deleteTodo}
              onToggle={toggleTodo}
              onEdit={editTodo}
            />
          ))}
        </div>
      )}
    </div>
  );
}
