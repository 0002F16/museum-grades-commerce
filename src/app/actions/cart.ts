"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  getCartItems,
  addCartItem,
  removeCartItem,
  clearCartItems,
  mergeCartItems,
} from "@/lib/cart";
import type { CartItem } from "@/types/cart";

/** Resolve the current user id from the session, or null for guests. */
async function currentUserId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.id ?? null;
}

/** Current user's DB cart (empty for guests). */
export async function getCartAction(): Promise<CartItem[]> {
  const userId = await currentUserId();
  if (!userId) return [];
  return getCartItems(userId);
}

/** Add a product to the current user's cart. No-op for guests. */
export async function addCartAction(productId: string): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;
  await addCartItem(userId, productId);
}

/** Remove a product from the current user's cart. No-op for guests. */
export async function removeCartAction(productId: string): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;
  await removeCartItem(userId, productId);
}

/** Empty the current user's cart. No-op for guests. */
export async function clearCartAction(): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;
  await clearCartItems(userId);
}

/**
 * Merge a guest cart (product ids) into the current user's DB cart on login,
 * then return the merged cart. No-op / empty for guests.
 */
export async function mergeCartAction(
  productIds: string[]
): Promise<CartItem[]> {
  const userId = await currentUserId();
  if (!userId) return [];
  await mergeCartItems(userId, productIds);
  return getCartItems(userId);
}
