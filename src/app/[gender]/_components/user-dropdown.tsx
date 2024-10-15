"use client";

import { signOut } from "@/app/(auth)/_actions";
import { useUser } from "@/lib/auth/provider";
import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { CircleAlert, CircleUser, ShoppingBag, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UserDropdown() {
  const [open, setOpen] = useState(false);
  const { user, setUser } = useUser();
  const router = useRouter();

  async function handleSignOut() {
    setUser(null);
    await signOut();
    router.push("/");
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <User />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <div>
            <span className="font-bold">Hello</span>
            <span className="block text-xs text-muted-foreground">
              {user?.email}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X />
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="h-14">
          <ShoppingBag />
          <span className="ml-6 text-base">My purchases</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="h-14" asChild>
          <Link href="/account">
            <CircleUser />
            <span className="ml-6 text-base">Personal details</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="h-14">
          <CircleAlert />
          <span className="ml-6 text-base">Privacy policy</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="p-3">
          <form action={handleSignOut}>
            <Button className="w-full h-full rounded-full font-bold text-lg">
              Sign out
            </Button>
          </form>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
