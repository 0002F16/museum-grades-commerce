"use server";

import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { squareClient, SQUARE_LOCATION_ID } from "@/lib/square";
import { getCartItems, clearCartItems } from "@/lib/cart";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { sendEmail } from "@/lib/email/client";
import {
  orderConfirmationEmail,
  newOrderAlertEmail,
  type EmailLineItem,
} from "@/lib/email/templates";
import type { ShippingAddress } from "@/types/order";

export type CheckoutResult =
  | { success: true; orderId: string }
  | { success: false; error: string };

/**
 * Creates a Square payment from a tokenised card (sourceId from Web Payments SDK),
 * records the order in the database, and clears the cart.
 */
export async function createPayment(
  sourceId: string,
  shipping: ShippingAddress
): Promise<CheckoutResult> {
  // 1. Auth
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in to check out." };
  }
  const userId = session.user.id;

  // 2. Cart
  const cartItems_ = await getCartItems(userId);
  if (cartItems_.length === 0) {
    return { success: false, error: "Your bag is empty." };
  }

  // 2b. Shipping address — required fields validated server-side.
  const ship = {
    name: shipping?.name?.trim() ?? "",
    phone: shipping?.phone?.trim() ?? "",
    line1: shipping?.line1?.trim() ?? "",
    line2: shipping?.line2?.trim() ?? "",
    city: shipping?.city?.trim() ?? "",
    state: shipping?.state?.trim() ?? "",
    postalCode: shipping?.postalCode?.trim() ?? "",
    country: shipping?.country?.trim() ?? "",
  };
  if (
    !ship.name ||
    !ship.line1 ||
    !ship.city ||
    !ship.state ||
    !ship.postalCode ||
    !ship.country
  ) {
    return { success: false, error: "Please complete your shipping address." };
  }

  // 3. Amount (prices are stored in dollars → convert to cents for Square)
  const subtotalCents = cartItems_.reduce((sum, item) => sum + item.price * 100, 0);

  // 4. Square payment
  let payment;
  try {
    const paymentResponse = await squareClient.payments.create({
      sourceId,
      idempotencyKey: randomUUID(),
      amountMoney: {
        amount: BigInt(subtotalCents),
        currency: "USD",
      },
      locationId: SQUARE_LOCATION_ID,
      note: `Museum Grades order — ${cartItems_.length} item${cartItems_.length > 1 ? "s" : ""}`,
    });
    payment = paymentResponse.payment;
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Payment failed. Please try again.";
    console.error("[checkout] Square payment error:", err);
    return { success: false, error: msg };
  }
  if (!payment?.id) {
    return { success: false, error: "Payment did not complete. Please try again." };
  }

  // 5. Persist order + items in one transaction
  const orderId = payment.id;
  await db.transaction(async (tx) => {
    await tx.insert(orders).values({
      id: orderId,
      userId,
      status: "completed",
      subtotalAmount: subtotalCents,
      totalAmount: subtotalCents,
      currency: "USD",
      squarePaymentId: payment.id!,
      squareReceiptUrl: payment.receiptUrl ?? null,
      shippingName: ship.name,
      shippingPhone: ship.phone || null,
      shippingLine1: ship.line1,
      shippingLine2: ship.line2 || null,
      shippingCity: ship.city,
      shippingState: ship.state,
      shippingPostalCode: ship.postalCode,
      shippingCountry: ship.country,
    });

    await tx.insert(orderItems).values(
      cartItems_.map((item) => ({
        orderId,
        productId: item.id,
        name: item.name,
        brand: item.brand,
        price: item.price * 100, // cents
        imageUrl: item.image ?? null,
        condition: item.condition,
        slug: item.slug,
      }))
    );
  });

  // 6. Clear cart
  await clearCartItems(userId);

  // 7. Notify — fail-safe; email problems never fail a completed order.
  const lineItems: EmailLineItem[] = cartItems_.map((item) => ({
    brand: item.brand,
    name: item.name,
    condition: item.condition,
    priceCents: item.price * 100,
  }));
  const baseUrl = process.env.BETTER_AUTH_URL ?? "";
  const orderUrl = `${baseUrl}/orders/${orderId}`;

  await sendEmail({
    to: session.user.email,
    ...orderConfirmationEmail({
      name: session.user.name,
      orderId,
      items: lineItems,
      totalCents: subtotalCents,
      receiptUrl: payment.receiptUrl ?? null,
      orderUrl,
      shipping: ship,
    }),
  });

  await sendEmail({
    to: process.env.ORDER_NOTIFICATION_EMAIL ?? "hr.museumestates@gmail.com",
    ...newOrderAlertEmail({
      orderId,
      customerName: session.user.name,
      customerEmail: session.user.email,
      items: lineItems,
      totalCents: subtotalCents,
      orderUrl: `${baseUrl}/admin/orders`,
      shipping: ship,
    }),
  });

  return { success: true, orderId };
}

/**
 * Returns all orders for the currently signed-in user, newest first.
 */
export async function getMyOrders() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return [];

  const rows = await db.query.orders.findMany({
    where: (o, { eq }) => eq(o.userId, session.user.id),
    orderBy: (o, { desc }) => [desc(o.createdAt)],
    with: { items: true },
  });
  return rows;
}
