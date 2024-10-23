import { db } from "@/lib/db/drizzle";
import { usersSchema, type NewUser } from "@/lib/db/schema";
import { createUserSession } from "@/models/session.server";
import { json } from "@remix-run/node";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

export async function comparePasswords(
  plainPassword: string,
  hashedPassword: string,
) {
  return await compare(plainPassword, hashedPassword);
}

export const login = async ({
  email,
  password,
}: { email: string; password: string }) => {
  const usersData = await db
    .select()
    .from(usersSchema)
    .where(eq(usersSchema.email, email))
    .limit(1);

  if (usersData.length === 0) {
    return json(
      {
        error: "Invalid email or password. Please try again.",
      },
      400,
    );
  }

  const [user] = usersData;

  const isPasswordValid = await comparePasswords(password, user.passwordHash);

  if (!isPasswordValid) {
    return json(
      {
        error: "Invalid email or password. Please try again.",
      },
      400,
    );
  }

  return createUserSession(user.id, "/");
};

const signUpSchema = z
  .object({
    name: z.string().min(3, {
      message: "Name is required and must be at least 3 characters",
    }),
    email: z.string().email({
      message: "Email is invalid",
    }),
    password: z.string().min(8, {
      message: "Password is required and must be at least 8 characters",
    }),
    passwordConfirm: z.string().min(8, {
      message: "Password is required and must be at least 8 characters",
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

export const signUp = async (data: z.infer<typeof signUpSchema>) => {
  const { name, email, password } = data;

  const existingUser = await db
    .select()
    .from(usersSchema)
    .where(eq(usersSchema.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return {
      error: "Failed to create user. Please try again.",
      data,
    };
  }

  const passwordHash = await hashPassword(password);

  const newUser: NewUser = {
    name,
    email,
    passwordHash,
  };

  const [createdUser] = await db
    .insert(usersSchema)
    .values(newUser)
    .returning();

  if (!createdUser) {
    return { error: "Failed to create user. Please try again.", data };
  }

  return createUserSession(createdUser.id, "/");
};