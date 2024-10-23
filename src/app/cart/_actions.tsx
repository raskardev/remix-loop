"use server";

import { z } from "zod";
import { validatedActionWithUser } from "../../../app/lib/auth/middleware";
import { createOrderWithItems } from "../../../app/lib/db/queries.server";
import { createCheckoutSession } from "../../../app/lib/stripe";

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
