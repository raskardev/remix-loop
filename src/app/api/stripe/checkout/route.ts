import { type NextRequest, NextResponse } from "next/server";
import { updateOrderByIdAndUserId } from "../../../../../app/lib/db/queries.server";
import { stripe } from "../../../../../app/lib/stripe";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(new URL("/cart", request.url));
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session.metadata) throw new Error("Session metadata is missing");

    const { client_reference_id: clientId, metadata } = session;
    const { orderId } = metadata;

    if (!clientId || !orderId)
      throw new Error("Client ID or order ID is missing");

    const success = await updateOrderByIdAndUserId({
      orderId,
      userId: clientId,
    });

    if (!success) throw new Error("Failed to update order status");

    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("Error handling successful checkout", error);
    return NextResponse.redirect(new URL("/error", request.url));
  }
}
