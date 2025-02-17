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
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Yeni görev ekle..."
            className="flex-1 p-2 border border-gray-300 bg-input rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="p-2 border border-gray-300 bg-input rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            className="px-4 py-2 bg-button text-white rounded-lg hover:bg-buttonHover focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Ekle
          </button>
        </div>
      </div>
    </form>
  );
}
