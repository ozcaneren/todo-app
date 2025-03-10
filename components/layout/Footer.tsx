"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProfileEditor from "../profile/ProfileEditor";
import Image from "next/image";

export default function Footer() {
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="w-full bg-background border-t border-borderColor border-dashed">
      <div className="p-4 container mx-auto bg-background border-r border-l border-borderColor border-dashed">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-text">Todo App</h1>
          {user && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowProfileEditor(true)}
                className="flex items-center gap-2 transition duration-200 hover:bg-gray-700 p-2 rounded-lg"
              >
                <Image
                  src={
                    user.avatarUrl ||
                    "https://ui-avatars.com/api/?background=random"
                  }
                  alt="Profil"
                  width={40}
                  height={40}
                  className="rounded-full object-cover w-10 h-10"
                  style={{ aspectRatio: "1/1" }}
                />
                <span className="text-md font-medium text-white">
                  {user.name}
                </span>
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
      </div>
    </header>
  );
}
