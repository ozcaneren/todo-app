'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProfileEditor from '../profile/ProfileEditor';
import Image from 'next/image';

export default function Header() {
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-gray-800 shadow-md">
      <div className="px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Todo App</h1>
        {user && (
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowProfileEditor(true)}
              className="flex items-center gap-2 transition duration-200 hover:bg-gray-700 p-2 rounded-lg"
            >
              <Image
                src={user.avatarUrl || 'https://ui-avatars.com/api/?background=random'}
                alt="Profil"
                width={40}
                height={40}
                className="rounded-full object-cover w-10 h-10"
                style={{ aspectRatio: '1/1' }}
              />
              <span className="text-md font-medium text-white">{user.name}</span>
            </button>
            <button
              onClick={handleLogout}
              className="text-sm px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
            >
              Çıkış Yap
            </button>
          </div>
        )}
      </div>

      {showProfileEditor && (
        <ProfileEditor onClose={() => setShowProfileEditor(false)} />
      )}
    </header>
  );
} 