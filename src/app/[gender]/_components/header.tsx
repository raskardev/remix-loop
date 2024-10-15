import { CategorySelector } from "@/app/[gender]/_components/category-selector";
import { SearchDialog } from "@/app/[gender]/_components/search-dialog";
import { UserButton } from "@/app/[gender]/_components/user-button";
import {
  getColors,
  getLowerAndUpperPrices,
  getMainCategories,
  getShoppingBagItems,
  getWishlistItems,
} from "@/lib/db/queries";
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
    <header className="sticky top-0 z-50 bg-transparent w-full">
      <div className="h-24 flex items-center relative">
        <Link
          href="/"
          className="text-xl md:text-4xl text-white uppercase font-bold justify-self-center md:absolute md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2"
        >
          LOOP
        </Link>
        <div className="flex items-center justify-self-end gap-x-4 ml-auto">
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
