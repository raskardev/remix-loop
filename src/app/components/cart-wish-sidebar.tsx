import { addRemoveProductToWishlist } from "@/app/[gender]/[[...category-product]]/_actions";
import { DeleteProductButton } from "@/app/[gender]/[[...category-product]]/components/delete-product-button";
import { LikeButton } from "@/app/[gender]/[[...category-product]]/components/like-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { getShoppingBagItems, getWishlistItems } from "@/lib/db/queries";

import { Heart, ShoppingBasket } from "lucide-react";
import Link from "next/link";

type Props = {
  shoppingBagItems: Awaited<ReturnType<typeof getShoppingBagItems>>;
  wishlistItems: Awaited<ReturnType<typeof getWishlistItems>>;
};

type ShoppingBagItemProps = {
  product: Awaited<ReturnType<typeof getShoppingBagItems>>[number];
};

type WishlistItemProps = {
  product: Awaited<ReturnType<typeof getWishlistItems>>[number];
};

const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

function ShoppingBagItem({ product }: ShoppingBagItemProps) {
  const genderSlug = product.gender === "M" ? "man" : "woman";
  const href = `/${genderSlug}/${product.categorySlug}/${product.productSlug}?color=${product.colorName?.toLowerCase()}`;

  return (
    <div className="flex space-x-5">
      <Link href={href} key={product.cartProductId}>
        <img
          src={product.imageUrl ?? ""}
          alt={product.productName ?? ""}
          className="w-28 h-full"
        />
      </Link>
      <div className="flex flex-col">
        <Link href={href}>
          <p>{product.productName}</p>
          <span className="font-bold">
            {priceFormatter.format(product.price ?? 0)}
          </span>
          <div className="flex space-x-3 text-muted-foreground">
            <span>{product.quantity} item</span> <span>|</span>
            <span>{product.sizeName}</span> <span>|</span>{" "}
            <span>{product.colorName}</span>
          </div>
        </Link>
        <div className="mt-4 flex space-x-3">
          <LikeButton
            isLiked={product.isWishlisted}
            productVariantId={product.productVariantId ?? ""}
          />
          <DeleteProductButton cartProductId={product.cartProductId ?? ""} />
        </div>
      </div>
    </div>
  );
}

function WishlistItem({ product }: WishlistItemProps) {
  const genderSlug = product.gender === "M" ? "man" : "woman";
  const href = `/${genderSlug}/${product.categorySlug}/${product.productSlug}?color=${product.colorName?.toLowerCase()}`;

  async function deleteItemFromWishlist(productVariantId: string | null) {
    if (!productVariantId) return;

    const formData = new FormData();
    formData.append("productVariantId", productVariantId);
    formData.append("action", "remove");

    await addRemoveProductToWishlist(
      {
        error: "",
        success: "",
      },
      formData,
    );
  }

  return (
    <div className="relative">
      <Link href={href}>
        <img src={product.imageUrl ?? ""} alt={product.name ?? ""} />
        <p className="mt-2">{product.name}</p>
        <span className="font-bold text-sm">
          {priceFormatter.format(product.price ?? 0)}
        </span>
      </Link>
      <Button
        onClick={() => deleteItemFromWishlist(product.productVariantId)}
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2"
      >
        <Heart className="fill-red-500 text-red-500" />
      </Button>
    </div>
  );
}

export function CartWishSidebar({ shoppingBagItems, wishlistItems }: Props) {
  const totalItems = shoppingBagItems.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );

  return (
    <Sheet>
      <SheetTrigger className="relative">
        <ShoppingBasket />
        {totalItems > 0 ? (
          <span className="absolute -bottom-2 -right-2 rounded-full bg-muted-foreground font-bold text-sm size-5 text-muted block">
            {totalItems}
          </span>
        ) : null}
      </SheetTrigger>
      <SheetContent>
        <Tabs defaultValue="shopping-bag" className="mt-4">
          <TabsList className="w-full mb-3">
            <TabsTrigger className="w-full" value="shopping-bag">
              Shopping bag
            </TabsTrigger>
            <TabsTrigger className="w-full" value="wishlist">
              Wishlist
            </TabsTrigger>
          </TabsList>
          <TabsContent value="shopping-bag">
            {shoppingBagItems.length > 0 ? (
              shoppingBagItems.map((item) => (
                <div key={item.cartProductId}>
                  <ShoppingBagItem product={item} />
                  <Separator className="my-2" />
                </div>
              ))
            ) : (
              <div className="text-center">
                <h3 className="text-2xl font-bold">
                  Your shopping bag is empty
                </h3>
                <p className="mt-4">Why not fill it up?</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="wishlist">
            {wishlistItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-1">
                {wishlistItems.map((item) => (
                  <WishlistItem key={item.productVariantId} product={item} />
                ))}
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-2xl font-bold">Your wishlish is empty</h3>
                <p className="mt-4">Why not fill it up?</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
