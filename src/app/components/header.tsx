import { CategorySelector } from "@/app/components/category-selector";
import { SearchDialog } from "@/app/components/search-dialog";
import { UserButton } from "@/app/components/user-button";
import {
  getColors,
  getLowerAndUpperPrices,
  getMainCategories,
  getShoppingBagItems,
  getWishlistItems,
} from "@/lib/db/queries";
import { Menu } from "lucide-react";
import Link from "next/link";

export async function Header() {
  const [categories, shoppingBagItems, wishlistItems, colors, minMaxPrices] =
    await Promise.all([
      getMainCategories(),
      getShoppingBagItems(),
      getWishlistItems(),
      getColors(),
      getLowerAndUpperPrices(),
    ]);

  return (
    <header className="sticky top-0 z-50 bg-transparent w-full px-12">
      <div className="h-24 grid grid-cols-3 items-center">
        <Menu color="white" />
        <Link
          href="/"
          className="text-xl md:text-4xl text-white uppercase font-bold justify-self-center invisible md:visible"
        >
          LOOP
        </Link>
        <div className="flex items-center justify-self-end gap-x-4">
          <SearchDialog />
          <UserButton
            shoppingBagItems={shoppingBagItems}
            wishlistItems={wishlistItems}
          />
        </div>
      </div>
      <CategorySelector
        categories={categories}
        colors={colors}
        minMaxPrices={minMaxPrices}
      />
    </header>
  );
}
