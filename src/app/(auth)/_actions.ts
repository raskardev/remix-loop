"use server";

import {
  validatedAction,
  validatedActionWithUser,
} from "@/lib/auth/middleware";
import { comparePasswords, hashPassword, setSession } from "@/lib/auth/session";
import { db } from "@/lib/db/drizzle";
import {
  addOrUpdateShippingAddress,
  deleteShippingAddress,
} from "@/lib/db/queries";
import { type NewUser, usersSchema } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100),
});

export const signIn = validatedAction(signInSchema, async (data, formData) => {
  const { email, password } = data;

  const usersData = await db
    .select()
    .from(usersSchema)
    .where(eq(usersSchema.email, email))
    .limit(1);

  if (usersData.length === 0) {
    return {
      error: "Invalid email or password. Please try again.",
      data,
    };
  }

  const [user] = usersData;

  const isPasswordValid = await comparePasswords(password, user.passwordHash);

  if (!isPasswordValid) {
    return {
      error: "Invalid email or password. Please try again.",
      data,
    };
  }

  await setSession(user);

  redirect("/");
});

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

export const signUp = validatedAction(signUpSchema, async (data, _) => {
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

  await setSession(createdUser);

  redirect("/");
});

export async function signOut() {
  cookies().delete("session");
}

const updateAccountSchema = z.object({
  name: z.string().min(3, {
    message: "Name is required and must be at least 3 characters",
  }),
  email: z.string().email({
    message: "Email is invalid",
  }),
});

export const updateAccount = validatedActionWithUser(
  updateAccountSchema,
  async (data, _, user) => {
    const { name, email } = data;

    await db
      .update(usersSchema)
      .set({ name, email })
      .where(eq(usersSchema.id, user.id));

    revalidatePath("/account");

    return { success: "Account updated successfully" };
  },
);

const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: "Password is required and must be at least 8 characters",
    }),
    newPassword: z.string().min(8, {
      message: "Password is required and must be at least 8 characters",
    }),
    passwordConfirm: z.string().min(8, {
      message: "Password is required and must be at least 8 characters",
    }),
  })
  .refine((data) => data.newPassword === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

export const updatePassword = validatedActionWithUser(
  updatePasswordSchema,
  async (data, _, user) => {
    const { currentPassword, newPassword } = data;

    const isPasswordValid = await comparePasswords(
      currentPassword,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      return {
        error: "Invalid current password. Please try again.",
        data,
      };
    }

    const passwordHash = await hashPassword(newPassword);

    await db
      .update(usersSchema)
      .set({ passwordHash })
      .where(eq(usersSchema.id, user.id));

    revalidatePath("/account");

    return { success: "Password updated successfully" };
  },
);

const addOrUpdateShippingAddressSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, {
    message: "Name is required and must be at least 3 characters",
  }),
  surnames: z.string().min(3, {
    message: "Surnames is required and must be at least 3 characters",
  }),
  country: z.string().min(3, {
    message: "Country is required and must be at least 3 characters",
  }),
  phoneNumber: z.string().min(3, {
    message: "Phone number is required and must be at least 3 characters",
  }),
  address: z.string().min(3, {
    message: "Address is required and must be at least 3 characters",
  }),
  additionalAddress: z.string().min(3, {
    message: "Additional address is required and must be at least 3 characters",
  }),
  remarks: z.string().optional(),
  postalCode: z.string().min(3, {
    message: "Postal code is required and must be at least 3 characters",
  }),
  population: z.string().min(3, {
    message: "Population is required and must be at least 3 characters",
  }),
  province: z.string().min(3, {
    message: "Province is required and must be at least 3 characters",
  }),
  type: z.enum(["add", "edit"]),
});

export const addOrUpdateShippingAddressAction = validatedActionWithUser(
  addOrUpdateShippingAddressSchema,
  async (data, _, user) => {
    const { type, ...shippingAddressData } = data;

    const shippingAddress = await addOrUpdateShippingAddress({
      shippingAddress: {
        ...shippingAddressData,
        userId: user.id,
      },
      type: data.type,
    });

    if (!shippingAddress) {
      return {
        error: "Failed to create shipping address. Please try again.",
        data,
      };
    }

    revalidatePath("/account");

    return { success: "Shipping address created successfully" };
  },
);

const deleteShippingAddressSchema = z.object({
  shippingAddressId: z.string(),
});

export const deleteShippingAddressAction = validatedActionWithUser(
  deleteShippingAddressSchema,
  async (data, _, user) => {
    const { shippingAddressId } = data;

    await deleteShippingAddress(shippingAddressId, user.id);

    revalidatePath("/account");

    return { success: "Shipping address deleted successfully" };
  },
);
