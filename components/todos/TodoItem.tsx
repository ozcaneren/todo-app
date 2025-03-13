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
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-background rounded-xl border border-borderColor shadow-sm gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full text-text rounded-lg border border-borderColor bg-transparent px-4 py-2.5 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-button"
            autoFocus
          />
          <select
            value={editedCategory}
            onChange={(e) => setEditedCategory(e.target.value)}
            className="w-full sm:w-40 border border-borderColor bg-background rounded-lg text-text px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-button"
          >
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            type="submit"
            className="flex-1 sm:flex-none text-sm bg-button text-white px-4 py-2.5 rounded-lg hover:bg-buttonHover transition-colors flex items-center justify-center gap-2"
            disabled={!editedTitle.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Kaydet
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="flex-1 sm:flex-none text-sm border border-borderColor text-text px-4 py-2.5 rounded-lg hover:bg-buttonHover transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            İptal
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className={`group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg- border border-[#333] rounded-xl mb-3 hover:bg-[#242424] transition-all duration-200`}>
      <div className="flex items-center gap-4 w-full">
        <div className="relative flex-shrink-0">
          <input
            type="checkbox"
            checked={completed}
            onChange={() => onToggle(id, !completed)}
            className="peer w-5 h-5 border-2 border-button rounded-md checked:bg-button checked:border-button focus:ring-2 focus:ring-button/30 transition-colors"
          />
          <svg 
            className="absolute top-0.5 left-0.5 w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className={`text-base font-medium transition-all truncate ${completed ? 'line-through text-textSecondary' : 'text-text'}`}>
              {title}
            </span>
            <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-text hover:text-white hover:bg-button rounded-lg transition-colors"
                title="Düzenle"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(id)}
                className="p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors"
                title="Sil"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2 text-sm">
            <div className={`flex items-center ${completed ? 'text-textSecondary' : 'text-text'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              {getCategoryName(category)}
            </div>
            <div className="flex items-center text-xs text-textSecondary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {dateLabel} {formatDate(dateToShow)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
