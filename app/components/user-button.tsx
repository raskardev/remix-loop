import { User } from "lucide-react";
import colors from "tailwindcss/colors";

import { CartWishSidebar } from "@/components/cart-wish-sidebar";
import { UserDropdown } from "@/components/user-dropdown";
import { Link } from "@remix-run/react";
import { useIndexLoaderData } from "@/routes/_index";
export function UserButton() {
  const indexData = useIndexLoaderData();

  return (
    <div className="flex items-center gap-x-3">
      {!indexData?.user ? (
        <Link to="/sign-in">
          <User color={colors.white} />
        </Link>
      ) : (
        <div className="flex items-center gap-x-4">
          <UserDropdown />
          <CartWishSidebar
            shoppingBagItems={indexData.shoppingBagItems}
            wishlistItems={indexData.wishlistItems}
          />
        </div>
      )}
    </div>
  );
}
