"use server";

import { validatedActionWithUser } from "@/lib/auth/middleware";
import { createOrderWithItems } from "@/lib/db/queries";
import { createCheckoutSession } from "@/lib/stripe";
import { z } from "zod";

const checkoutActionSchema = z.object({
  shippingAddressId: z.string({
    message: "The shipping address is required",
  }),
});

export const checkoutAction = validatedActionWithUser(
  checkoutActionSchema,
  async (data, _, user) => {
    const order = await createOrderWithItems({
      shippingAddressId: data.shippingAddressId,
      userId: user.id,
    });

    if (!order) return { error: "Failed to create order. Please try again." };

    await createCheckoutSession(order.id);
  },
);
