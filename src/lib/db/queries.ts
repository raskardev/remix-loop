import { verifyToken } from "@/lib/auth/session";
import { db } from "@/lib/db/drizzle";
import {
  categoriesSchema,
  productVariantsSchema,
  productsSchema,
  usersSchema,
} from "@/lib/db/schema";
import { type SQL, and, eq, gte, inArray, isNull } from "drizzle-orm";
import { cookies } from "next/headers";

type GetProductsArgs = {
  gender: "M" | "F";
  category: string[];
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
    .where(isNull(categoriesSchema.parentId));

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
  const categoryId = await getCategoryIdBySlug(category?.[0]);

  const whereFilters: SQL[] = [
    gte(productVariantsSchema.stock, 1),
    inArray(productsSchema.targetGender, [gender, "U"]),
  ];

  if (categoryId) {
    whereFilters.push(eq(productsSchema.categoryId, categoryId));
  }

  const products = await db
    .select({
      id: productVariantsSchema.id,
      price: productVariantsSchema.price,
      name: productsSchema.name,
      imageUrl: productVariantsSchema.imageUrl,
    })
    .from(productVariantsSchema)
    .leftJoin(
      productsSchema,
      eq(productVariantsSchema.productId, productsSchema.id),
    )
    .where(and(...whereFilters));

  return products;
}
