'use client';
import { useState } from 'react';

interface TodoItemProps {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  categories: Array<{ _id: string; name: string }>;
  createdAt: string;
  updatedAt: string;
  onDelete: (id: string) => void;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (id: string, newTitle: string, newCategory: string) => void;
}

export default function TodoItem({ 
  id, 
  title, 
  completed,
  category,
  categories,
  createdAt, 
  updatedAt,
  onDelete, 
  onToggle, 
  onEdit 
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedCategory, setEditedCategory] = useState(category);

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      return new Intl.DateTimeFormat('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  };

  const isEdited = createdAt !== updatedAt;
  const dateToShow = isEdited ? updatedAt : createdAt;
  const dateLabel = isEdited ? 'Düzenlendi:' : 'Oluşturuldu:';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedTitle.trim()) {
      onEdit(id, editedTitle, editedCategory);
      setIsEditing(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : 'Kategori Yok';
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center justify-between p-4 bg-background rounded-lg border border-borderColor">
        <div className="flex gap-2 flex-1">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="flex-1 text-text rounded-md border border-borderColor bg-transparent px-3 py-1 text-base transition-colors"
            autoFocus
          />
          <select
            value={editedCategory}
            onChange={(e) => setEditedCategory(e.target.value)}
            className="border border-borderColor bg-background rounded-lg text-text px-2"
          >
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="ml-2 flex gap-2">
          <button
            type="submit"
            className="text-sm bg-button text-white px-2 py-1.5 rounded hover:bg-buttonHover"
          >
            Kaydet
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-sm bg-button text-white px-2 py-1.5 rounded hover:bg-buttonHover"
          >
            İptal
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className={`flex items-center justify-between p-4 bg-background border border-borderColor rounded-lg mb-2 ${completed ? 'bg-button' : ''}`}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={completed}
            onChange={() => onToggle(id, !completed)}
            className="w-4 h-4"
          />
          <span className={completed ? 'line-through text-gray-500' : 'text-text'}>
            {title}
          </span>
          <span className={completed ? 'text-sm p-2 border border-dashed border-gray-600 rounded-full text-textSecondary' : 'text-sm p-2 border border-dashed border-borderColor rounded-full text-textSecondary'}>
            {getCategoryName(category)}
          </span>
        </div>
        <span className="text-xs text-textSecondary ml-7">
          {dateLabel} {formatDate(dateToShow)}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="text-indigo-600 hover:text-indigo-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(id)}
          className="text-red-500 hover:text-red-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
