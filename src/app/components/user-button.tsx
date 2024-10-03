"use client";

import { CartWishSidebar } from "@/app/components/cart-wish-sidebar";
import { UserDropdown } from "@/app/components/user-dropdown";
import { useUser } from "@/lib/auth/provider";
import type { getShoppingBagItems, getWishlistItems } from "@/lib/db/queries";
import { User } from "lucide-react";
import Link from "next/link";
import colors from "tailwindcss/colors";

type Props = {
  shoppingBagItems: Awaited<ReturnType<typeof getShoppingBagItems>>;
  wishlistItems: Awaited<ReturnType<typeof getWishlistItems>>;
};

export function UserButton({ shoppingBagItems, wishlistItems }: Props) {
  const { user } = useUser();

  return (
    <div className="flex items-center gap-x-3">
      {!user ? (
        <Link href="/sign-in">
          <User color={colors.white} />
        </Link>
      ) : (
        <div className="flex items-center gap-x-4">
          <UserDropdown />
          <CartWishSidebar
            shoppingBagItems={shoppingBagItems}
            wishlistItems={wishlistItems}
          />
        </div>
      )}
    </div>
  );
}
