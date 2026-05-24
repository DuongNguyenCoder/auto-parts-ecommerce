"use client";

import Image from "next/image";
import { useAuth } from "../features/auth/hooks/use-auth";

export default function Home() {
  const { logout, isLoggingOut, authError } = useAuth();

  const onSubmit = async () => {
    await logout();
  };
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div onClick={onSubmit} className="cursor-pointer">
          Hello word~
        </div>
      </main>
    </div>
  );
}
