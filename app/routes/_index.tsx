import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@vercel/remix";
import { getShoppingBagItems, getWishlistItems } from "@/lib/db/queries";

export const loader = async () => {
  const [shoppingBagItems, wishlistItems] = await Promise.all([
    getShoppingBagItems(),
    getWishlistItems(),
  ]);

  return json({
    shoppingBagItems,
    wishlistItems,
  });
};

export default function Home() {
  const { shoppingBagItems, wishlistItems } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="min-h-dvh grid grid-cols-1 md:grid-cols-2 absolute inset-0">
        <Link
          to="/woman"
          className="relative flex items-center justify-center group overflow-hidden bg-[url(/woman.jpg)] bg-cover bg-center"
        >
          <div className="absolute bg-black/20 inset-0 group-hover:bg-transparent duration-300" />
          <h2 className="text-7xl text-white z-10">Woman</h2>
        </Link>
        <Link
          to="/man"
          className="relative flex items-center justify-center group overflow-hidden bg-[url(/man.jpg)] bg-cover bg-center"
        >
          <div className="absolute bg-black/20 inset-0 group-hover:bg-transparent duration-300" />
          <h2 className="text-7xl text-white z-10">Man</h2>
        </Link>
      </div>
    </>
  );
}
