import {
  createWishlist,
  existsWishlist,
  getProducts,
} from "@/lib/db/queries.server";
import type { User } from "@/lib/db/schema";
import { z } from "zod";

const getProductsByNameSchema = z.object({
  name: z.string().min(3),
});

export const getProductsByName = async (
  data: z.infer<typeof getProductsByNameSchema>,
  request: Request,
) => {
  const { name } = data;

  const products = await getProducts({
    request,
    searchTerm: name,
  });

  return {
    products,
  };
};

const addRemoveProductToWishlistSchema = z.object({
  productVariantId: z.string(),
  action: z.enum(["add", "remove"]),
});

export const addRemoveProductToWishlist = async ({
  data,
  user,
}: { data: z.infer<typeof addRemoveProductToWishlistSchema>; user: User }) => {
  const result = addRemoveProductToWishlistSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

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

    return { success: "Product added to wishlist successfully." };
  }
  await deleteWishlist({
    productVariantId,
    userId,
  });

  return { success: "Product removed from wishlist successfully." };
};
