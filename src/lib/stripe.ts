import { getShoppingBagItems, getUser } from "@/lib/db/queries";
import { redirect } from "next/navigation";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing Stripe secret key");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-09-30.acacia",
});

export async function createCheckoutSession(orderId: string) {
  const user = await getUser();

  if (!user) redirect("/sign-in");

  const shoppingBagItems = await getShoppingBagItems();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: shoppingBagItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "eur",
        product_data: {
          name: item.productName ?? "",
          images: [item.imageUrl ?? ""],
        },
        unit_amount: item.price ?? 0,
      },
    })),
    metadata: {
      orderId,
    },
    mode: "payment",
    success_url: `${process.env.BASE_URL}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/cart`,
    client_reference_id: user.id,
  });

  if (!session.url) throw new Error("Failed to create checkout session");

  redirect(session.url);
}
