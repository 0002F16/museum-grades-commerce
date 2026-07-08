import "server-only";
import { db } from "@/db";

export interface OrderSummary {
  id: string;
  status: string;
  totalAmount: number; // cents
  createdAt: Date;
  itemCount: number;
  items: { id: number; name: string; brand: string; imageUrl: string | null }[];
}

/** Orders belonging to a user, newest first — for the account order history. */
export async function getOrdersByUser(userId: string): Promise<OrderSummary[]> {
  try {
    const rows = await db.query.orders.findMany({
      where: (o, { eq }) => eq(o.userId, userId),
      with: { items: true },
      orderBy: (o, { desc }) => [desc(o.createdAt)],
    });

    return rows.map((o) => ({
      id: o.id,
      status: o.status,
      totalAmount: o.totalAmount,
      createdAt: o.createdAt,
      itemCount: o.items.length,
      items: o.items.map((i) => ({
        id: i.id,
        name: i.name,
        brand: i.brand,
        imageUrl: i.imageUrl,
      })),
    }));
  } catch (err) {
    console.error("getOrdersByUser failed:", err);
    return [];
  }
}
