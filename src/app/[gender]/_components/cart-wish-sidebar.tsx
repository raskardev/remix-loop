import { addRemoveProductToWishlist } from "@/app/[gender]/_actions";
import { DeleteProductButton } from "@/app/[gender]/_components/delete-product-button";
import { LikeButton } from "@/app/[gender]/_components/like-button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Heart, ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { Badge } from "../../../../app/components/ui/badge";
import { Button } from "../../../../app/components/ui/button";
import { Separator } from "../../../../app/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../../app/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../app/components/ui/tabs";
import type {
  ShoppingBagItem as ShoppingBagItemType,
  WishlistItem as WishlistItemType,
} from "../../../../app/lib/types";
import { priceToEuro } from "../../../../app/lib/utils";

type Props = {
  shoppingBagItems: ShoppingBagItemType[];
  wishlistItems: WishlistItemType[];
};

type ShoppingBagItemProps = {
  product: ShoppingBagItemType;
};

type WishlistItemProps = {
  product: WishlistItemType;
};

const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

function ShoppingBagItem({ product }: ShoppingBagItemProps) {
  const genderSlug = product.gender === "M" ? "man" : "woman";
  const href = `/${genderSlug}/${product.categorySlug}/${product.productSlug}?color=${product.colorName?.toLowerCase()}`;

  const formattedPrice = priceFormatter.format(priceToEuro(product.price));

  return (
    <div className="flex space-x-5">
      <SheetClose asChild>
        <Link href={href} key={product.cartProductId}>
          <img
            src={product.imageUrl ?? ""}
            alt={product.productName ?? ""}
            className="w-28 h-full"
          />
        </Link>
      </SheetClose>
      <div className="flex flex-col">
        <SheetClose asChild>
          <Link href={href}>
            <p>{product.productName}</p>
            <span className="font-bold">{formattedPrice}</span>
            <div className="flex space-x-3 text-muted-foreground">
              <span>{product.quantity} item</span> <span>|</span>
              <span>{product.sizeName}</span> <span>|</span>{" "}
              <span>{product.colorName}</span>
            </div>
          </Link>
        </SheetClose>
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

  const formattedPrice = priceFormatter.format(priceToEuro(product.price));

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
      <SheetClose asChild>
        <Link href={href}>
          <img src={product.imageUrl ?? ""} alt={product.name ?? ""} />
          <p className="mt-2">{product.name}</p>
          <span className="font-bold text-sm">{formattedPrice}</span>
        </Link>
      </SheetClose>
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

  const formattedPrice = priceFormatter.format(
    priceToEuro(
      shoppingBagItems.reduce(
        (acc, item) => acc + (item.price ?? 0) * item.quantity,
        0,
      ),
    ),
  );

  return (
    <Sheet>
      <SheetTrigger className="relative">
        <ShoppingBasket />
        {totalItems > 0 ? (
          <Badge className="absolute -bottom-2 -right-2 rounded-full size-5 flex items-center justify-center">
            {totalItems}
          </Badge>
        ) : null}
      </SheetTrigger>
      <SheetContent>
        <VisuallyHidden>
          <SheetHeader>
            <SheetTitle>Shopping bag and wishlist sidebar</SheetTitle>
            <SheetDescription>
              Here you can see your shopping bag and wishlist items.
            </SheetDescription>
          </SheetHeader>
        </VisuallyHidden>
        <Tabs defaultValue="shopping-bag" className="h-full flex flex-col pt-4">
          <TabsList className="w-full mb-3">
            <TabsTrigger className="w-full" value="shopping-bag">
              Shopping bag
            </TabsTrigger>
            <TabsTrigger className="w-full" value="wishlist">
              Wishlist
            </TabsTrigger>
          </TabsList>
          <TabsContent value="shopping-bag" className="flex-1">
            {shoppingBagItems.length > 0 ? (
              <div className="h-full flex flex-col">
                <div className="flex-1">
                  {shoppingBagItems.map((item) => (
                    <div key={item.cartProductId}>
                      <ShoppingBagItem product={item} />
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-xl font-bold">{formattedPrice}</span>
                  </div>
                  <Button
                    className="w-full mt-4 h-12 rounded-full font-bold"
                    asChild
                  >
                    <SheetClose asChild>
                      <Link href="/cart">Process order</Link>
                    </SheetClose>
                  </Button>
                </div>
              </div>
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
