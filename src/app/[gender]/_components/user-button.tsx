"use client";

import { CartWishSidebar } from "@/app/[gender]/_components/cart-wish-sidebar";
import { UserDropdown } from "@/app/[gender]/_components/user-dropdown";
import { User } from "lucide-react";
import Link from "next/link";
import colors from "tailwindcss/colors";
import { useUser } from "../../../../app/lib/auth/provider";
import type {} from "../../../../app/lib/db/queries.server";
import type { ShoppingBagItem, WishlistItem } from "../../../../app/lib/types";

type Props = {
  shoppingBagItems: ShoppingBagItem[];
  wishlistItems: WishlistItem[];
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
