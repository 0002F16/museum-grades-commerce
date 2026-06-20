import "server-only";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  brands,
  categories,
  products,
  productImages,
  orders,
  user,
} from "@/db/schema";
import { slugify } from "@/lib/slug";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface DashboardCounts {
  products: number;
  accounts: number;
  orders: number;
  revenueCents: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
}

export interface AdminShipping {
  name: string | null;
  phone: string | null;
  line1: string | null;
  line2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
}

export interface AdminOrder {
  id: string;
  status: string;
  totalAmount: number; // cents
  currency: string;
  squareReceiptUrl: string | null;
  createdAt: Date;
  customerName: string | null;
  customerEmail: string | null;
  shipping: AdminShipping | null;
  items: { id: number; name: string; brand: string; price: number }[];
}

export interface ProductFormValues {
  id: string;
  brand: string;
  category: string;
  name: string;
  price: number;
  estRetail: number;
  condition: string;
  color: string;
  material: string;
  description: string;
  imageUrls: string[];
}

const CONDITIONS = ["New", "Excellent", "Shows Wear", "Worn", "Fair"] as const;

// ─── Dashboard ──────────────────────────────────────────────────────────────

export async function dashboardCounts(): Promise<DashboardCounts> {
  const [[p], [u], [o], [rev]] = await Promise.all([
    db.select({ n: sql<number>`count(*)::int` }).from(products),
    db.select({ n: sql<number>`count(*)::int` }).from(user),
    db.select({ n: sql<number>`count(*)::int` }).from(orders),
    db
      .select({ n: sql<number>`coalesce(sum(${orders.totalAmount}),0)::int` })
      .from(orders),
  ]);
  return {
    products: p?.n ?? 0,
    accounts: u?.n ?? 0,
    orders: o?.n ?? 0,
    revenueCents: rev?.n ?? 0,
  };
}

// ─── Accounts ───────────────────────────────────────────────────────────────

export async function listUsers(): Promise<AdminUser[]> {
  const rows = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    })
    .from(user)
    .orderBy(desc(user.createdAt));
  return rows;
}

// ─── Orders ─────────────────────────────────────────────────────────────────

export async function listOrders(): Promise<AdminOrder[]> {
  const rows = await db.query.orders.findMany({
    with: {
      items: true,
      user: { columns: { name: true, email: true } },
    },
    orderBy: (o, { desc: d }) => [d(o.createdAt)],
  });

  return rows.map((o) => ({
    id: o.id,
    status: o.status,
    totalAmount: o.totalAmount,
    currency: o.currency,
    squareReceiptUrl: o.squareReceiptUrl,
    createdAt: o.createdAt,
    customerName: o.user?.name ?? null,
    customerEmail: o.user?.email ?? null,
    shipping: o.shippingLine1
      ? {
          name: o.shippingName,
          phone: o.shippingPhone,
          line1: o.shippingLine1,
          line2: o.shippingLine2,
          city: o.shippingCity,
          state: o.shippingState,
          postalCode: o.shippingPostalCode,
          country: o.shippingCountry,
        }
      : null,
    items: o.items.map((it) => ({
      id: it.id,
      name: it.name,
      brand: it.brand,
      price: it.price,
    })),
  }));
}

// ─── Product create / edit / delete ─────────────────────────────────────────

interface ParsedProduct {
  brand: string;
  category: string;
  name: string;
  price: number;
  estRetail: number;
  condition: string;
  color: string;
  material: string;
  description: string;
  imageUrls: string[];
}

function parseProductForm(formData: FormData): ParsedProduct {
  const get = (k: string) => String(formData.get(k) ?? "").trim();

  const brand = get("brand");
  const category = get("category");
  const name = get("name");
  const price = Math.round(Number(get("price")));
  const estRetailRaw = get("estRetail");
  const estRetail = estRetailRaw ? Math.round(Number(estRetailRaw)) : price;
  const condition = get("condition");
  const color = get("color");
  const material = get("material");
  const description = get("description");
  const imageUrls = get("imageUrls")
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (!brand) throw new Error("Brand is required.");
  if (!category) throw new Error("Category is required.");
  if (!name) throw new Error("Name is required.");
  if (!Number.isFinite(price) || price <= 0)
    throw new Error("Price must be a positive number.");
  if (!CONDITIONS.includes(condition as (typeof CONDITIONS)[number]))
    throw new Error("Condition must be one of: " + CONDITIONS.join(", ") + ".");
  if (imageUrls.length === 0)
    throw new Error("At least one image URL is required.");

  return {
    brand,
    category,
    name,
    price,
    estRetail,
    condition,
    color,
    material,
    description,
    imageUrls,
  };
}

/** Upsert a brand by name, returning its id. Mirrors src/db/seed.ts. */
async function upsertBrand(name: string): Promise<number> {
  const [row] = await db
    .insert(brands)
    .values({ name, slug: slugify(name) })
    .onConflictDoUpdate({ target: brands.name, set: { slug: slugify(name) } })
    .returning();
  return row.id;
}

/** Upsert a category by name, returning its id. Mirrors src/db/seed.ts. */
async function upsertCategory(name: string): Promise<number> {
  const [row] = await db
    .insert(categories)
    .values({ name, slug: slugify(name), displayOrder: 999 })
    .onConflictDoUpdate({
      target: categories.name,
      set: { slug: slugify(name) },
    })
    .returning();
  return row.id;
}

function computeSavings(price: number, estRetail: number): number {
  if (estRetail > price) return Math.round((1 - price / estRetail) * 100);
  return 0;
}

async function replaceImages(productId: string, urls: string[]): Promise<void> {
  await db.delete(productImages).where(eq(productImages.productId, productId));
  if (urls.length > 0) {
    await db
      .insert(productImages)
      .values(urls.map((url, i) => ({ productId, url, position: i })));
  }
}

export async function createProduct(formData: FormData): Promise<string> {
  const data = parseProductForm(formData);
  const brandId = await upsertBrand(data.brand);
  const categoryId = await upsertCategory(data.category);

  const id = `mg-${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 6)}`;
  // id tail keeps the slug unique without a pre-check.
  const slug = `${slugify(`${data.brand}-${data.name}`)}-${id.slice(3)}`;

  await db.insert(products).values({
    id,
    slug,
    brandId,
    categoryId,
    name: data.name,
    price: data.price,
    estRetail: data.estRetail,
    savingsPercent: computeSavings(data.price, data.estRetail),
    condition: data.condition,
    color: data.color,
    material: data.material,
    description: data.description,
    itemNumber: id,
    exterior: "",
    hardware: "",
    interior: "",
    comesWith: "",
    sizeBase: "",
    sizeHeight: "",
    sizeDepth: "",
    sizeDrop: "",
  });

  await replaceImages(id, data.imageUrls);
  return id;
}

export async function updateProduct(
  id: string,
  formData: FormData
): Promise<void> {
  const data = parseProductForm(formData);
  const brandId = await upsertBrand(data.brand);
  const categoryId = await upsertCategory(data.category);

  await db
    .update(products)
    .set({
      brandId,
      categoryId,
      name: data.name,
      price: data.price,
      estRetail: data.estRetail,
      savingsPercent: computeSavings(data.price, data.estRetail),
      condition: data.condition,
      color: data.color,
      material: data.material,
      description: data.description,
    })
    .where(eq(products.id, id));

  await replaceImages(id, data.imageUrls);
}

export async function deleteProduct(id: string): Promise<void> {
  // product_images and cart_items cascade; order_items are snapshots (no FK)
  // and are intentionally preserved so historical orders stay intact.
  await db.delete(products).where(eq(products.id, id));
}

/** Load a product + its brand/category names + ordered image URLs for editing. */
export async function getProductForEdit(
  id: string
): Promise<ProductFormValues | null> {
  const [row] = await db
    .select({
      id: products.id,
      brand: brands.name,
      category: categories.name,
      name: products.name,
      price: products.price,
      estRetail: products.estRetail,
      condition: products.condition,
      color: products.color,
      material: products.material,
      description: products.description,
    })
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.id, id))
    .limit(1);

  if (!row) return null;

  const imgs = await db
    .select({ url: productImages.url })
    .from(productImages)
    .where(eq(productImages.productId, id))
    .orderBy(productImages.position);

  return { ...row, imageUrls: imgs.map((i) => i.url) };
}
