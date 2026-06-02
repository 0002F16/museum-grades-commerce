import "server-only";
import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { cartItems, products, brands, productImages } from "@/db/schema";
import type { CartItem } from "@/types/cart";

// ─── Per-user cart data access (DB-backed) ────────────────────────────────────
// Stores only references; CartItem display fields are re-derived by joining to
// products/brands + the first product image. Mirrors the pattern in products.ts.

/**
 * Return the user's cart as fully-populated CartItem[] (newest first),
 * joining product + brand + first image. Silently drops items whose product
 * no longer exists in the catalogue.
 */
export async function getCartItems(userId: string): Promise<CartItem[]> {
  try {
    const rows = await db
      .select({
        id: products.id,
        slug: products.slug,
        name: products.name,
        brand: brands.name,
        price: products.price,
        condition: products.condition,
        addedAt: cartItems.createdAt,
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .innerJoin(brands, eq(products.brandId, brands.id))
      .where(eq(cartItems.userId, userId))
      .orderBy(asc(cartItems.createdAt));

    if (rows.length === 0) return [];

    // First image per product, by position.
    const imgRows = await db
      .select({ productId: productImages.productId, url: productImages.url })
      .from(productImages)
      .where(inArray(productImages.productId, rows.map((r) => r.id)))
      .orderBy(asc(productImages.position));

    const firstImage = new Map<string, string>();
    for (const img of imgRows) {
      if (!firstImage.has(img.productId)) firstImage.set(img.productId, img.url);
    }

    return rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      brand: r.brand,
      price: r.price,
      condition: r.condition,
      image: firstImage.get(r.id) ?? "",
    }));
  } catch (err) {
    console.error("getCartItems failed:", err);
    return [];
  }
}

/** Add a product to the user's cart (no-op if already present). */
export async function addCartItem(
  userId: string,
  productId: string
): Promise<void> {
  try {
    await db
      .insert(cartItems)
      .values({ userId, productId })
      .onConflictDoNothing();
  } catch (err) {
    console.error("addCartItem failed:", err);
  }
}

/** Remove a single product from the user's cart. */
export async function removeCartItem(
  userId: string,
  productId: string
): Promise<void> {
  try {
    await db
      .delete(cartItems)
      .where(
        and(eq(cartItems.userId, userId), eq(cartItems.productId, productId))
      );
  } catch (err) {
    console.error("removeCartItem failed:", err);
  }
}

/** Empty the user's cart. */
export async function clearCartItems(userId: string): Promise<void> {
  try {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  } catch (err) {
    console.error("clearCartItems failed:", err);
  }
}

/** Bulk-add product ids (login merge of a guest cart). Ignores duplicates. */
export async function mergeCartItems(
  userId: string,
  productIds: string[]
): Promise<void> {
  if (productIds.length === 0) return;
  try {
    await db
      .insert(cartItems)
      .values(productIds.map((productId) => ({ userId, productId })))
      .onConflictDoNothing();
  } catch (err) {
    console.error("mergeCartItems failed:", err);
  }
}
