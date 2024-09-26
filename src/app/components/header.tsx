"use client";

import { UserDropdown } from "@/app/components/user-dropdown";
import { useUser } from "@/lib/auth/provider";
import { Menu, User } from "lucide-react";
import Link from "next/link";
import colors from "tailwindcss/colors";

export function Header() {
  const { user } = useUser();

  return (
    <header className="fixed top-0 z-50 bg-transparent w-full flex items-center justify-between px-12 h-24">
      <Menu color="white" />
      <Link
        href="/"
        className="text-4xl text-white uppercase font-bold flex items-center gap-x-3"
      >
        LOOP
      </Link>
      <div className="flex items-center gap-x-3">
        {!user ? (
          <Link href="/sign-in">
            <User color={colors.white} />
          </Link>
        ) : (
          <UserDropdown />
        )}
      </div>
    </header>
  );
}
