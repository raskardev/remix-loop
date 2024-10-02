import { verifyToken } from "@/lib/auth/session";
import { db } from "@/lib/db/drizzle";
import {
  categoriesSchema,
  productVariantsSchema,
  productsSchema,
  usersSchema,
  wishlistsSchema,
} from "@/lib/db/schema";
import {
  type SQL,
  and,
  eq,
  gte,
  inArray,
  isNotNull,
  isNull,
} from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";

type GetProductsArgs = {
  gender: "M" | "F";
  category: string;
};

type CreateDeleteWishlistArgs = {
  productVariantId: string;
  userId: string;
};

type ExistsWishlistArgs = {
  productVariantId: string;
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
    .select()
    .from(categoriesSchema)
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

export async function getProducts({ gender, category }: GetProductsArgs) {
  noStore();

  const user = await getUser();
  const categoryId = await getCategoryIdBySlug(category);

  const whereFilters: SQL[] = [
    gte(productVariantsSchema.stock, 1),
    inArray(productsSchema.targetGender, [gender, "U"]),
    eq(productsSchema.active, true),
  ];

  if (categoryId) {
    whereFilters.push(eq(productsSchema.categoryId, categoryId));
  }

  const products = await db
    .select({
      productVariantId: productVariantsSchema.id,
      price: productVariantsSchema.price,
      name: productsSchema.name,
      imageUrl: productVariantsSchema.imageUrl,
      productSlug: productsSchema.slug,
      categorySlug: categoriesSchema.slug,
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
    .where(and(...whereFilters))
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

  const product = await db
    .select({
      name: productsSchema.name,
      description: productsSchema.description,
      price: productVariantsSchema.price,
      imageUrl: productVariantsSchema.imageUrl,
      productVariantId: productVariantsSchema.id,
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
    .where(and(eq(productsSchema.slug, slug), eq(productsSchema.active, true)))
    .limit(1)
    .then((result) =>
      result.map((product) => ({
        ...product,
        isWishlisted: product.isWishlisted === 1,
      })),
    );

  if (product.length === 0) return null;

  return product[0];
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
