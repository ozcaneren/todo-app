'use client';
import { useState } from 'react';

interface Category {
  _id: string;
  name: string;
}

interface AddTodoProps {
  onAdd: (title: string, categoryId: string) => void;
  categories: Category[];
}

export default function AddTodo({ onAdd, categories }: AddTodoProps) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && categoryId) {
      onAdd(title.trim(), categoryId);
      setTitle('');
      setCategoryId('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Yeni görev ekle..."
            className="w-full text-text rounded-lg border border-borderColor bg-transparent px-4 py-2.5 text-base shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-button"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:w-auto">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full sm:w-40 bg-background text-text px-4 py-2.5 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-button"
            required
          >
            <option value="">Kategori seç</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-button text-white rounded-lg hover:bg-buttonHover transition-colors flex items-center justify-center gap-2"
            disabled={!title.trim() || !categoryId}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Ekle
          </button>
        </div>
      </div>
    </form>
  );
}
