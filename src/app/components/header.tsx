"use client";

import { signOut } from "@/app/(auth)/actions";
import { useUser } from "@/lib/auth/provider";
import { LogOut, Menu, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import colors from "tailwindcss/colors";

export function Header() {
  const { user, setUser } = useUser();
  const router = useRouter();

  async function handleSignOut() {
    setUser(null);
    await signOut();
    router.push("/");
  }

  return (
    <header className="fixed top-0 z-50 bg-transparent w-full py-8 bg-red-500 flex items-center justify-between px-12">
      <Menu color="white" />
      <Link
        href="/"
        className="text-4xl text-white uppercase font-bold flex items-center gap-x-3"
      >
        LOOP
      </Link>
      <div className="flex items-center gap-x-3">
        <Link href="/sign-in">
          <User fill={user ? "white" : "none"} color={colors.white} />
        </Link>
        {user ? (
          <form action={handleSignOut} className="p-1">
            <button type="submit" className="flex w-full">
              <LogOut color={colors.white} />
            </button>
          </form>
        ) : null}
      </div>
    </header>
  );
}
