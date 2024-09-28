"use client";

import { UserDropdown } from "@/app/components/user-dropdown";
import { useUser } from "@/lib/auth/provider";
import { User } from "lucide-react";
import Link from "next/link";
import colors from "tailwindcss/colors";

export function UserButton() {
  const { user } = useUser();

  return (
    <div className="flex items-center gap-x-3">
      {!user ? (
        <Link href="/sign-in">
          <User color={colors.white} />
        </Link>
      ) : (
        <UserDropdown />
      )}
    </div>
  );
}
