"use server";

import { validatedActionWithUser } from "@/lib/auth/middleware";
import {
  createWishlist,
  deleteWishlist,
  existsWishlist,
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
