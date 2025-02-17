"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProfileEditor from "../profile/ProfileEditor";

export default function Sidebar() {
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="hidden md:fixed md:block min-h-screen h-full lg:w-64 xl:w-80 border-r border-gray-200 dark:border-gray-600 bg-[#f3f5f7] dark:bg-[#1f1f1f]">
      <div className="h-full py-4">
        {user && (
          <div className="h-full flex flex-col items-center justify-between">
            <div className="hover:bg-gray-700 rounded-md p-2">
              <button
                onClick={() => setShowProfileEditor(true)}
                className="flex items-center gap-2"
              >
                <div className="flex items-center justify-center px-5 h-16">
                  <img
                    src={
                      user.avatarUrl ||
                      "https://ui-avatars.com/api/?background=random"
                    }
                    width={30}
                    height={30}
                    alt="Profil"
                    className="rounded-full object-cover object-center w-[45px] h-[45px]"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://ui-avatars.com/api/?background=random";
                    }}
                  />
                  <div className="mx-2">
                    <h1 className="text-lg font-medium text-black dark:text-white">
                      {user.name}
                    </h1>
                  </div>
                </div>
              </button>
            </div>

            <div className="flex items-center justify-center px-3">
              <div className="flex flex-col items-start justify-start gap-y-2 w-full my-4">
                <button
                  onClick={handleLogout}
                  className="text-sm px-3 py-1 text-red-600 hover:text-red-800"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {showProfileEditor && (
        <ProfileEditor onClose={() => setShowProfileEditor(false)} />
      )}
    </div>
  );
}
