import { SearchDialog } from "@/app/[gender]/_components/search-dialog";
import { UserButton } from "@/app/[gender]/_components/user-button";
import Link from "next/link";
import {
  getShoppingBagItems,
  getWishlistItems,
} from "../../../../app/lib/db/queries";

export async function Header() {
  const [shoppingBagItems, wishlistItems] = await Promise.all([
    getShoppingBagItems(),
    getWishlistItems(),
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
    </header>
  );
}
