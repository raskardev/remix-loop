import { CategorySelector } from "@/app/components/category-selector";
import { SearchDialog } from "@/app/components/search-dialog";
import { UserButton } from "@/app/components/user-button";
import {
  getMainCategories,
  getShoppingBagItems,
  getWishlistItems,
} from "@/lib/db/queries";
import { Menu } from "lucide-react";
import Link from "next/link";

export async function Header() {
  const categories = await getMainCategories();
  const shoppingBagItems = await getShoppingBagItems();
  const wishlistItems = await getWishlistItems();

  return (
    <header className="sticky top-0 z-50 bg-transparent w-full px-12">
      <div className="h-24 grid grid-cols-3 items-center">
        <Menu color="white" />
        <Link
          href="/"
          className="text-4xl text-white uppercase font-bold justify-self-center"
        >
          LOOP
        </Link>
        <div className="flex items-center gap-x-6 justify-self-end">
          <SearchDialog />
          <UserButton
            shoppingBagItems={shoppingBagItems}
            wishlistItems={wishlistItems}
          />
        </div>
      </div>
      <CategorySelector categories={categories} />
    </header>
  );
}
