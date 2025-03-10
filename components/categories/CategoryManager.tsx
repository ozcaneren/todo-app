'use client';
import { useState } from 'react';

interface Category {
  _id: string;
  name: string;
  userId: string;
}

interface CategoryManagerProps {
  categories: Category[];
  onCategoryAdd: (name: string) => Promise<void>;
  onCategoryDelete: (id: string) => Promise<void>;
}

export default function CategoryManager({ categories, onCategoryAdd, onCategoryDelete }: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      onCategoryAdd(newCategory.trim());
      setNewCategory('');
    }
  };

  return (
    <div className="mb-6 p-4 bg-background rounded-lg border border-borderColor">
      <h2 className="text-lg font-semibold mb-4 text-text">Kategoriler</h2>
      
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Yeni kategori ekle..."
          className="flex-1 text-text rounded-md border border-borderColor bg-transparent px-3 py-1 text-base shadow-sm transition-colors"
          />
        <button
          type="submit"
          className="px-4 py-2 bg-button text-text rounded-lg hover:bg-buttonHover transition-colors"
        >
          Ekle
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <div
            key={category._id}
            className="flex items-center text-text gap-2 px-3 py-1 bg-button rounded-full"
          >
            <span>{category.name}</span>
            <button
              onClick={() => onCategoryDelete(category._id)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 