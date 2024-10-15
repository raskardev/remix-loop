import type { getProductsByName } from "@/app/[gender]/_actions";
import type {
  getLowerAndUpperPrices,
  getMainCategories,
  getProducts,
  getShippingAddresses,
  getShoppingBagItems,
  getWishlistItems,
} from "@/lib/db/queries";

export type ProductDetail = {
  name: string;
  description: string;
  variants: {
    imageUrl: string;
    isWishlisted: boolean;
    productVariantId: string;
    colorName: string;
    sizes: {
      sizeId: string;
      productVariantSizeId: string;
      name: string;
      price: number;
      stock: number;
    }[];
  }[];
};

export type ShippingAddress = Awaited<
  ReturnType<typeof getShippingAddresses>
>[number];

export type Product = Awaited<ReturnType<typeof getProducts>>[number];

export type ProductByName = Awaited<
  ReturnType<typeof getProductsByName>
>["products"][number];

export type ShoppingBagItem = Awaited<
  ReturnType<typeof getShoppingBagItems>
>[number];

export type WishlistItem = Awaited<ReturnType<typeof getWishlistItems>>[number];

export type Category = Awaited<ReturnType<typeof getMainCategories>>[number];

export type MinMaxPrices = Awaited<ReturnType<typeof getLowerAndUpperPrices>>;
