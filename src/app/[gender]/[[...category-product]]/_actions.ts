"use server";

import { validatedActionWithUser } from "@/lib/auth/middleware";
import {
  addOrUpdateProductToCart,
  createWishlist,
  deleteWishlist,
  existsWishlist,
  getOrCreateCart,
} from "@/lib/db/queries";
import {} from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const addProductToWishlistSchema = z.object({
  productVariantId: z.string(),
  action: z.enum(["add", "remove"]),
});

export const addProductToWishlist = validatedActionWithUser(
  addProductToWishlistSchema,
  async (data, _, user) => {
    const { productVariantId, action } = data;
    const { id: userId } = user;

    if (action === "add") {
      const exists = await existsWishlist({
        productVariantId,
        userId,
      });

      if (exists) {
        return { error: "Product already in wishlist. Please try again." };
      }

      const wishlist = createWishlist({
        productVariantId,
        userId,
      });

      if (!wishlist) {
        return { error: "Failed to create wishlist. Please try again." };
      }

      // TODO: change to more specific path
      revalidatePath("/:gender");
      return { success: "Product added to wishlist successfully." };
    }
    await deleteWishlist({
      productVariantId,
      userId,
    });

    // TODO: change to more specific path
    revalidatePath("/:gender");
    return { success: "Product removed from wishlist successfully." };
  },
);

const addProductToCartSchema = z.object({
  productVariantId: z.string(),
  quantity: z.coerce.number().min(1).max(10),
});

export const addToCart = validatedActionWithUser(
  addProductToCartSchema,
  async (data, _, user) => {
    const { productVariantId, quantity } = data;
    const { id: userId } = user;

    const cart = await getOrCreateCart(userId);

    if (!cart) return { error: "Failed to create cart. Please try again." };

    const { id: cartId } = cart;

    await addOrUpdateProductToCart({
      productVariantId,
      quantity,
      cartId,
    });

    // TODO: change to more specific path
    // revalidatePath("/:gender");

    return { success: "Product added to cart successfully." };
  },
);
