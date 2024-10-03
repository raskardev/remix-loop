"use server";

import {
  validatedAction,
  validatedActionWithUser,
} from "@/lib/auth/middleware";
import {
  addOrUpdateProductToCart,
  createWishlist,
  deleteWishlist,
  existsWishlist,
  getOrCreateCart,
  getProducts,
  removeProductFromCart,
} from "@/lib/db/queries";
import {} from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const addRemoveProductToWishlistSchema = z.object({
  productVariantId: z.string(),
  action: z.enum(["add", "remove"]),
});

export const addRemoveProductToWishlist = validatedActionWithUser(
  addRemoveProductToWishlistSchema,
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
  productVariantSizeId: z.string(),
  quantity: z.coerce.number().min(1).max(10),
});

export const addToCart = validatedActionWithUser(
  addProductToCartSchema,
  async (data, _, user) => {
    const { productVariantSizeId, quantity } = data;
    const { id: userId } = user;

    const cart = await getOrCreateCart(userId);

    if (!cart) return { error: "Failed to create cart. Please try again." };

    const { id: cartId } = cart;

    await addOrUpdateProductToCart({
      productVariantSizeId,
      quantity,
      cartId,
    });

    // TODO: change to more specific path
    revalidatePath("/:gender");

    return { success: "Product added to cart successfully." };
  },
);

const removeFromCartSchema = z.object({
  cartProductId: z.string(),
});

export const removeFromCart = validatedActionWithUser(
  removeFromCartSchema,
  async (data, _, user) => {
    const { cartProductId } = data;

    await removeProductFromCart(cartProductId);

    revalidatePath("/:gender");

    return { success: "Product removed from cart successfully." };
  },
);

const getProductsByNameSchema = z.object({
  name: z.string().min(3),
});

export const getProductsByName = validatedAction(
  getProductsByNameSchema,
  async (data) => {
    const { name } = data;

    const products = await getProducts({
      searchTerm: name,
    });

    return {
      products,
    };
  },
);
