"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProfileEditor from "../profile/ProfileEditor";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="w-full bg-background border-b border-borderColor border-dashed">
      <div className="p-4 container mx-auto bg-background border-r border-l border-borderColor border-dashed">
        <div className="flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-text">Todo App</h1>
          </Link>
          {!user && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/login")}
                className="text-sm px-4 py-2 bg-primary text-background rounded-lg "
              >
                Giriş Yap
              </button>
              <button
                onClick={() => router.push("/register")}
                className="text-sm px-4 py-2 bg-primary text-background rounded-lg "
              >
                Kayıt Ol
              </button>
            </div>
          )}
          {user && (
            <div className="flex items-center gap-4">
              <div className="p-2 border border-borderColor rounded-lg">
                <button
                  onClick={() => setShowProfileEditor(true)}
                  className="flex items-center gap-2 transition duration-200 hover:bg-gray-700 rounded-lg"
                >
                  <Image
                    src={
                      user.avatarUrl ||
                      "https://ui-avatars.com/api/?background=random"
                    }
                    alt="Profil"
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                    style={{ aspectRatio: "1/1" }}
                  />
                  <span className="text-md font-medium text-white">
                    {user.name}
                  </span>
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm px-4 py-2 bg-text text-background rounded-lg"
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
