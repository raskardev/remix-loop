import { verifyToken } from "../auth/session";
import { db } from "./drizzle";
import {
  type NewShippingAddress,
  cartProductsSchema,
  cartsSchema,
  categoriesSchema,
  colorsSchema,
  orderItemsSchema,
  ordersSchema,
  productVariantSizes,
  productVariantsSchema,
  productsSchema,
  shippingAddressesSchema,
  sizesSchema,
  usersSchema,
  wishlistsSchema,
} from "./schema";
import type { ProductDetail } from "../types";
import {
  type SQL,
  and,
  asc,
  desc,
  eq,
  gte,
  inArray,
  isNotNull,
  isNull,
  like,
  lte,
  max,
  min,
} from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";

type GetProductsArgs = {
  gender?: "M" | "F";
  category?: string;
  searchTerm?: string;
  orderBy?: string;
  color?: string;
  priceMin?: number;
  priceMax?: number;
};

type CreateDeleteWishlistArgs = {
  productVariantId: string;
  userId: string;
};

type ExistsWishlistArgs = {
  productVariantId: string;
  userId: string;
};

type AddToCartArgs = {
  productVariantSizeId: string;
  cartId: string;
  quantity: number;
};

type ExistsInCartArgs = {
  productVariantSizeId: string;
  cartId: string;
};

type AddOrUpdateShippingAddress = {
  shippingAddress: NewShippingAddress;
  type: "add" | "edit";
};

type CreateOrderWithItemsArgs = {
  shippingAddressId: string;
  userId: string;
};

type UpdateOrderByIdAndUserIdArgs = {
  orderId: string;
  userId: string;
};

export async function getUser() {
  const sessionCookie = cookies().get("session");

  if (!sessionCookie || !sessionCookie.value) return null;

  const sessionData = await verifyToken(sessionCookie.value);

  if (!sessionData || !sessionData.user || !sessionData.user.id) return null;

  if (new Date(sessionData.expires) < new Date()) return null;

  const user = await db
    .select()
    .from(usersSchema)
    .where(eq(usersSchema.id, sessionData.user.id))
    .limit(1);

  if (user.length === 0) return null;

  return user[0];
}

export async function getMainCategories() {
  const categories = await db
    .selectDistinct({
      id: categoriesSchema.id,
      name: categoriesSchema.name,
      slug: categoriesSchema.slug,
    })
    .from(categoriesSchema)
    .innerJoin(
      productsSchema,
      eq(categoriesSchema.id, productsSchema.categoryId),
    )
    .where(
      and(isNull(categoriesSchema.parentId), eq(categoriesSchema.active, true)),
    );

  return categories;
}

async function getCategoryIdBySlug(slug?: string) {
  if (!slug) return null;

  const category = await db
    .select()
    .from(categoriesSchema)
    .where(eq(categoriesSchema.slug, slug));

  if (category.length === 0) return null;

  return category[0].id;
}

export async function getProducts({
  gender,
  category,
  searchTerm,
  orderBy,
  color,
  priceMin,
  priceMax,
}: GetProductsArgs) {
  noStore();

  const user = await getUser();
  const categoryId = await getCategoryIdBySlug(category);

  const whereFilters: SQL[] = [
    gte(productVariantSizes.stock, 1),
    eq(productsSchema.active, true),
  ];

  if (gender) {
    whereFilters.push(inArray(productsSchema.targetGender, [gender]));
  }

  if (categoryId) {
    whereFilters.push(eq(productsSchema.categoryId, categoryId));
  }

  if (searchTerm) {
    whereFilters.push(like(productsSchema.name, `%${searchTerm}%`));
  }

  if (color) {
    whereFilters.push(like(colorsSchema.name, `%${color}%`));
  }

  if (priceMin) {
    whereFilters.push(gte(productsSchema.price, priceMin));
  }

  if (priceMax) {
    whereFilters.push(lte(productsSchema.price, priceMax));
  }

  const products = await db
    .select({
      productVariantId: productVariantsSchema.id,
      price: productsSchema.price,
      name: productsSchema.name,
      gender: productsSchema.targetGender,
      imageUrl: productVariantsSchema.imageUrl,
      productSlug: productsSchema.slug,
      categorySlug: categoriesSchema.slug,
      colorName: colorsSchema.name,
      createdAt: productVariantsSchema.createdAt,
      isWishlisted: isNotNull(wishlistsSchema.userId),
    })
    .from(productVariantsSchema)
    .leftJoin(
      productsSchema,
      eq(productVariantsSchema.productId, productsSchema.id),
    )
    .leftJoin(
      categoriesSchema,
      eq(productsSchema.categoryId, categoriesSchema.id),
    )
    .leftJoin(
      wishlistsSchema,
      and(
        eq(productVariantsSchema.id, wishlistsSchema.productVariantId),
        eq(wishlistsSchema.userId, user?.id ?? ""),
      ),
    )
    .leftJoin(colorsSchema, eq(productVariantsSchema.colorId, colorsSchema.id))
    .leftJoin(
      productVariantSizes,
      eq(productVariantsSchema.id, productVariantSizes.productVariantId),
    )
    .groupBy(productsSchema.id, productVariantsSchema.colorId)
    .where(and(...whereFilters))
    .orderBy(
      orderBy === "price_asc"
        ? asc(productsSchema.price)
        : desc(productsSchema.price),
    )
    .then((result) =>
      result.map((product) => ({
        ...product,
        isWishlisted: product.isWishlisted === 1,
      })),
    );

  return products;
}

export async function getProduct(slug: string) {
  noStore();

  const user = await getUser();

  const products = await db
    .select({
      productName: productsSchema.name,
      productDescription: productsSchema.description,
      productVariantId: productVariantsSchema.id,
      productVariantSizeId: productVariantSizes.id,
      price: productsSchema.price,
      stock: productVariantSizes.stock,
      imageUrl: productVariantsSchema.imageUrl,
      sizeName: sizesSchema.name,
      sizeId: sizesSchema.id,
      colorName: colorsSchema.name,
      isWishlisted: isNotNull(wishlistsSchema.userId),
    })
    .from(productVariantsSchema)
    .leftJoin(
      productsSchema,
      eq(productVariantsSchema.productId, productsSchema.id),
    )
    .leftJoin(
      wishlistsSchema,
      and(
        eq(productVariantsSchema.id, wishlistsSchema.productVariantId),
        eq(wishlistsSchema.userId, user?.id ?? ""),
      ),
    )
    .leftJoin(
      productVariantSizes,
      eq(productVariantsSchema.id, productVariantSizes.productVariantId),
    )
    .leftJoin(sizesSchema, eq(productVariantSizes.sizeId, sizesSchema.id))
    .leftJoin(colorsSchema, eq(productVariantsSchema.colorId, colorsSchema.id))
    .where(and(eq(productsSchema.slug, slug), eq(productsSchema.active, true)))
    .then((result) =>
      result.map((product) => ({
        ...product,
        isWishlisted: product.isWishlisted === 1,
      })),
    );

  if (products.length === 0) return null;

  const product: ProductDetail = {
    name: products[0].productName ?? "",
    description: products[0].productDescription ?? "",
    variants: [],
  };

  const variantMap = new Map<string, ProductDetail["variants"][number]>();

  for (const product of products) {
    const {
      productVariantId,
      stock,
      imageUrl,
      price,
      sizeId,
      colorName,
      sizeName,
      productVariantSizeId,
      isWishlisted,
    } = product;
    if (
      !colorName ||
      !sizeName ||
      !price ||
      !sizeId ||
      !stock ||
      !productVariantSizeId
    )
      continue;

    if (!variantMap.has(colorName)) {
      variantMap.set(colorName, {
        colorName,
        imageUrl,
        productVariantId,
        isWishlisted,
        sizes: [],
      });
    }

    variantMap.get(colorName)?.sizes.push({
      name: sizeName,
      sizeId,
      productVariantSizeId,
      price,
      stock,
    });
  }

  product.variants = Array.from(variantMap.values());

  return product;
}

export async function existsWishlist({
  productVariantId,
  userId,
}: ExistsWishlistArgs) {
  const wishlist = await db
    .select()
    .from(wishlistsSchema)
    .where(
      and(
        eq(wishlistsSchema.productVariantId, productVariantId),
        eq(wishlistsSchema.userId, userId),
      ),
    );

  return wishlist.length > 0;
}

export async function createWishlist({
  productVariantId,
  userId,
}: CreateDeleteWishlistArgs) {
  const [createdWishlist] = await db
    .insert(wishlistsSchema)
    .values({
      userId,
      productVariantId,
    })
    .returning();

  if (!createdWishlist) return null;

  return createdWishlist;
}

export async function deleteWishlist({
  productVariantId,
  userId,
}: CreateDeleteWishlistArgs) {
  await db
    .delete(wishlistsSchema)
    .where(
      and(
        eq(wishlistsSchema.userId, userId),
        eq(wishlistsSchema.productVariantId, productVariantId),
      ),
    );
}

export async function getWishlistItems() {
  const user = await getUser();
  if (!user) return [];

  const wishlist = await db
    .select({
      productVariantId: productVariantsSchema.id,
      imageUrl: productVariantsSchema.imageUrl,
      name: productsSchema.name,
      price: productsSchema.price,
      gender: productsSchema.targetGender,
      productSlug: productsSchema.slug,
      categorySlug: categoriesSchema.slug,
      colorName: colorsSchema.name,
    })
    .from(wishlistsSchema)
    .leftJoin(
      productVariantsSchema,
      eq(wishlistsSchema.productVariantId, productVariantsSchema.id),
    )
    .leftJoin(
      productsSchema,
      eq(productVariantsSchema.productId, productsSchema.id),
    )
    .leftJoin(
      categoriesSchema,
      eq(productsSchema.categoryId, categoriesSchema.id),
    )
    .leftJoin(colorsSchema, eq(productVariantsSchema.colorId, colorsSchema.id))
    .where(eq(wishlistsSchema.userId, user.id));

  return wishlist;
}

export async function getCart() {
  const user = await getUser();

  if (!user) return null;

  const card = await db
    .select()
    .from(cartsSchema)
    .where(eq(cartsSchema.userId, user.id))
    .limit(1);

  if (card.length === 0) return null;

  return card[0];
}

export async function getOrCreateCart(userId: string) {
  const cart = await getCart();

  if (cart) return cart;

  const [createdCart] = await db
    .insert(cartsSchema)
    .values({
      userId,
    })
    .returning();

  if (!createdCart) return null;

  return createdCart;
}

export async function getProductInCart({
  productVariantSizeId,
  cartId,
}: ExistsInCartArgs) {
  const product = await db
    .select()
    .from(cartProductsSchema)
    .where(
      and(
        eq(cartProductsSchema.productVariantSizeId, productVariantSizeId),
        eq(cartProductsSchema.cartId, cartId),
      ),
    )
    .limit(1);

  if (product.length === 0) return null;

  return product[0];
}

export async function addOrUpdateProductToCart({
  productVariantSizeId,
  quantity,
  cartId,
}: AddToCartArgs) {
  const productInCart = await getProductInCart({
    productVariantSizeId,
    cartId,
  });

  if (!productInCart) {
    const [createdCartProduct] = await db
      .insert(cartProductsSchema)
      .values({
        productVariantSizeId,
        quantity,
        cartId,
      })
      .returning();

    if (!createdCartProduct) return null;

    return createdCartProduct;
  }

  await db
    .update(cartProductsSchema)
    .set({ quantity: quantity + productInCart.quantity })
    .where(
      and(
        eq(cartProductsSchema.productVariantSizeId, productVariantSizeId),
        eq(cartProductsSchema.cartId, cartId),
      ),
    );
}

export async function getShoppingBagItems() {
  const cart = await getCart();
  if (!cart) return [];

  const products = await db
    .select({
      cartProductId: cartProductsSchema.id,
      quantity: cartProductsSchema.quantity,
      sizeName: sizesSchema.name,
      productName: productsSchema.name,
      price: productsSchema.price,
      colorName: colorsSchema.name,
      imageUrl: productVariantsSchema.imageUrl,
      isWishlisted: isNotNull(wishlistsSchema.userId),
      productVariantId: productVariantsSchema.id,
      productVariantSizeId: productVariantSizes.id,
      gender: productsSchema.targetGender,
      productSlug: productsSchema.slug,
      categorySlug: categoriesSchema.slug,
    })
    .from(cartProductsSchema)
    .leftJoin(
      productVariantSizes,
      eq(cartProductsSchema.productVariantSizeId, productVariantSizes.id),
    )
    .leftJoin(
      productVariantsSchema,
      eq(productVariantSizes.productVariantId, productVariantsSchema.id),
    )
    .leftJoin(
      wishlistsSchema,
      and(
        eq(productVariantsSchema.id, wishlistsSchema.productVariantId),
        eq(wishlistsSchema.userId, cart.userId ?? ""),
      ),
    )
    .leftJoin(
      productsSchema,
      eq(productVariantsSchema.productId, productsSchema.id),
    )
    .leftJoin(
      categoriesSchema,
      eq(productsSchema.categoryId, categoriesSchema.id),
    )
    .leftJoin(colorsSchema, eq(productVariantsSchema.colorId, colorsSchema.id))
    .leftJoin(sizesSchema, eq(productVariantSizes.sizeId, sizesSchema.id))
    .where(eq(cartProductsSchema.cartId, cart.id))
    .then((result) =>
      result.map((product) => ({
        ...product,
        isWishlisted: product.isWishlisted === 1,
      })),
    );

  return products;
}

export async function removeProductFromCart(cartProductId: string) {
  const cart = await getCart();

  if (!cart) return null;

  await db
    .delete(cartProductsSchema)
    .where(
      and(
        eq(cartProductsSchema.id, cartProductId),
        eq(cartProductsSchema.cartId, cart.id),
      ),
    );
}

export async function getColors() {
  const colors = await db
    .selectDistinct({ name: colorsSchema.name })
    .from(colorsSchema)
    .innerJoin(
      productVariantsSchema,
      eq(colorsSchema.id, productVariantsSchema.colorId),
    );

  return colors.map((color) => color.name);
}

export async function getLowerAndUpperPrices() {
  const prices = await db
    .select({
      max: max(productsSchema.price),
      min: min(productsSchema.price),
    })
    .from(productsSchema)
    .limit(1);

  if (prices.length === 0 || !prices[0].min || !prices[0].max) return null;

  return {
    max: prices[0].max,
    min: prices[0].min,
  };
}

export async function getShippingAddresses() {
  const user = await getUser();
  if (!user) return [];

  const shippingAddresses = await db
    .select({
      id: shippingAddressesSchema.id,
      name: shippingAddressesSchema.name,
      surnames: shippingAddressesSchema.surnames,
      country: shippingAddressesSchema.country,
      phoneNumber: shippingAddressesSchema.phoneNumber,
      address: shippingAddressesSchema.address,
      additionalAddress: shippingAddressesSchema.additionalAddress,
      remarks: shippingAddressesSchema.remarks,
      postalCode: shippingAddressesSchema.postalCode,
      population: shippingAddressesSchema.population,
      province: shippingAddressesSchema.province,
    })
    .from(shippingAddressesSchema)
    .where(eq(shippingAddressesSchema.userId, user.id));

  return shippingAddresses;
}

export async function addOrUpdateShippingAddress({
  shippingAddress,
  type,
}: AddOrUpdateShippingAddress) {
  if (type === "add") {
    const { id, ...shippingAddressWithoutId } = shippingAddress;

    const [createdAddress] = await db
      .insert(shippingAddressesSchema)
      .values(shippingAddressWithoutId)
      .returning();

    if (!createdAddress) return null;

    return createdAddress;
  }

  const [updatedAddress] = await db
    .update(shippingAddressesSchema)
    .set(shippingAddress)
    .where(
      and(
        eq(shippingAddressesSchema.id, shippingAddress.id ?? ""),
        eq(shippingAddressesSchema.userId, shippingAddress.userId ?? ""),
      ),
    )
    .returning();

  if (!updatedAddress) return null;

  return updatedAddress;
}

export async function deleteShippingAddress(
  shippingAddressId: string,
  userId: string,
) {
  await db
    .delete(shippingAddressesSchema)
    .where(
      and(
        eq(shippingAddressesSchema.id, shippingAddressId),
        eq(shippingAddressesSchema.userId, userId),
      ),
    );
}

export async function createOrderWithItems({
  shippingAddressId,
  userId,
}: CreateOrderWithItemsArgs) {
  const shoppingBagItems = await getShoppingBagItems();

  const totalPrice = shoppingBagItems.reduce(
    (acc, item) => acc + (item.price ?? 0) * item.quantity,
    0,
  );

  const [order] = await db
    .insert(ordersSchema)
    .values({
      userId,
      amount: totalPrice,
      shippingAddressId,
      status: "pending",
    })
    .returning();

  if (!order) return null;

  const { id: orderId } = order;

  const promises = shoppingBagItems.map((item) =>
    db.insert(orderItemsSchema).values({
      quantity: item.quantity,
      orderId,
      productVariantId: item.productVariantId,
    }),
  );

  const promisesResult = await Promise.allSettled(promises);

  if (promisesResult.some((result) => result.status === "rejected")) {
    // TODO: delete order and the other items
    return null;
  }

  return order;
}

export async function deleteCart(userId: string) {
  const cart = await getCart();

  if (!cart) return null;

  await db
    .delete(cartProductsSchema)
    .where(eq(cartProductsSchema.cartId, cart.id));
}

export async function updateOrderByIdAndUserId({
  orderId,
  userId,
}: UpdateOrderByIdAndUserIdArgs) {
  const success = await db
    .update(ordersSchema)
    .set({ status: "completed" })
    .where(and(eq(ordersSchema.id, orderId), eq(ordersSchema.userId, userId)))
    .then(() => true)
    .catch(() => false);

  await deleteCart(userId);

  return success;
}
