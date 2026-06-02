// Shared cart item shape — referenced by both the client cart context and the
// server-only cart data layer. Each luxury piece is one-of-one (no quantity).
export interface CartItem {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  condition: string;
}
