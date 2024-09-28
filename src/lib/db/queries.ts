import { verifyToken } from "@/lib/auth/session";
import { db } from "@/lib/db/drizzle";
import { categoriesSchema, usersSchema } from "@/lib/db/schema";
import { eq, isNull } from "drizzle-orm";
import { cookies } from "next/headers";

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
