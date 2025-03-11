"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center mx-auto">
      <div className="w-full flex flex-col gap-4 justify-center items-center">
        <div className="flex flex-col justify-center items-center gap-2 mt-2">
          <h1 className="text-4xl font-bold text-text">To Do List</h1>
          <p className="text-textSecondary mt-1 text-center">
            Yapilacaklarinizi burada ekleyebilir ve duzenleyebilirsiniz.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => router.push("/login")}
              className="text-sm px-4 py-2 bg-primary text-background rounded-lg"
            >
              Giriş Yap
            </button>
            <div>Dahasini Ogren {"->"}</div>
          </div>
        </div>
        <div className="mt-4 p-2 border border-borderColor rounded-lg">
          <Image
            src="/landing2.png"
            alt="To do list"
            width={1200}
            height={1000}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
