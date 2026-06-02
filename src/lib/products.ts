import "server-only";
import { and, asc, desc, eq, gte, lte, ilike, or, sql, inArray } from "drizzle-orm";
import { db } from "@/db";
import { brands, categories, products, productImages } from "@/db/schema";
import type {
  Product,
  ProductFilters,
  FilterGroup,
  CategoryItem,
} from "@/types/product";

export type { CategoryItem } from "@/types/product";

// ─── row → Product adapter ──────────────────────────────────────────────────

type ProductRow = typeof products.$inferSelect & {
  brandName: string;
  categoryName: string;
};

function rowToProduct(row: ProductRow, images: string[]): Product {
  return {
    id: row.id,
    slug: row.slug,
    brand: row.brandName,
    name: row.name,
    price: row.price,
    estRetail: row.estRetail,
    savingsPercent: row.savingsPercent,
    condition: row.condition as Product["condition"],
    color: row.color,
    material: row.material,
    bagType: row.categoryName,
    images,
    description: row.description,
    itemNumber: row.itemNumber,
    exterior: row.exterior,
    hardware: row.hardware,
    interior: row.interior,
    comesWith: row.comesWith,
    size: {
      base: row.sizeBase,
      height: row.sizeHeight,
      depth: row.sizeDepth,
      drop: row.sizeDrop,
    },
  };
}

// Fetch images for a set of product ids, ordered by position, grouped by product.
async function imagesByProduct(
  productIds: string[]
): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>();
  if (productIds.length === 0) return map;
  const rows = await db
    .select()
    .from(productImages)
    .where(inArray(productImages.productId, productIds))
    .orderBy(asc(productImages.position));
  for (const img of rows) {
    if (!map.has(img.productId)) map.set(img.productId, []);
    map.get(img.productId)!.push(img.url);
  }
  return map;
}

function buildWhere(filters: ProductFilters) {
  const conds = [];
  if (filters.query) {
    const like = `%${filters.query}%`;
    conds.push(
      or(
        ilike(products.name, like),
        ilike(brands.name, like),
        ilike(products.description, like),
        ilike(products.color, like),
        ilike(products.material, like),
        ilike(categories.name, like)
      )
    );
  }
  if (filters.brand) conds.push(eq(brands.name, filters.brand));
  if (filters.condition) conds.push(eq(products.condition, filters.condition));
  if (filters.color) conds.push(eq(products.color, filters.color));
  if (filters.material) conds.push(eq(products.material, filters.material));
  if (filters.bagType) conds.push(eq(categories.name, filters.bagType));
  if (filters.priceMin !== undefined)
    conds.push(gte(products.price, filters.priceMin));
  if (filters.priceMax !== undefined)
    conds.push(lte(products.price, filters.priceMax));
  return conds.length > 0 ? and(...conds) : undefined;
}

const baseSelect = {
  id: products.id,
  slug: products.slug,
  brandId: products.brandId,
  categoryId: products.categoryId,
  name: products.name,
  price: products.price,
  estRetail: products.estRetail,
  savingsPercent: products.savingsPercent,
  condition: products.condition,
  color: products.color,
  material: products.material,
  description: products.description,
  itemNumber: products.itemNumber,
  exterior: products.exterior,
  hardware: products.hardware,
  interior: products.interior,
  comesWith: products.comesWith,
  sizeBase: products.sizeBase,
  sizeHeight: products.sizeHeight,
  sizeDepth: products.sizeDepth,
  sizeDrop: products.sizeDrop,
  createdAt: products.createdAt,
  brandName: brands.name,
  categoryName: categories.name,
} as const;

// ─── public API (same signatures as before, now async + DB-backed) ───────────

export async function getProducts(
  filters: ProductFilters = {}
): Promise<{ products: Product[]; total: number }> {
  try {
    const pageSize = filters.pageSize ?? 24;
    const page = filters.page ?? 1;
    const where = buildWhere(filters);

    const orderBy =
      filters.sort === "price-asc"
        ? asc(products.price)
        : filters.sort === "price-desc"
          ? desc(products.price)
          : desc(products.createdAt); // "newest"

    const rows = await db
      .select(baseSelect)
      .from(products)
      .innerJoin(brands, eq(products.brandId, brands.id))
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(where)
      .orderBy(orderBy)
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .innerJoin(brands, eq(products.brandId, brands.id))
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(where);

    const imgMap = await imagesByProduct(rows.map((r) => r.id));
    const list = rows.map((r) => rowToProduct(r, imgMap.get(r.id) ?? []));

    return { products: list, total: count };
  } catch (err) {
    console.error("getProducts failed:", err);
    return { products: [], total: 0 };
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const [row] = await db
      .select(baseSelect)
      .from(products)
      .innerJoin(brands, eq(products.brandId, brands.id))
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.slug, slug))
      .limit(1);

    if (!row) return null;
    const imgMap = await imagesByProduct([row.id]);
    return rowToProduct(row, imgMap.get(row.id) ?? []);
  } catch (err) {
    console.error("getProductBySlug failed:", err);
    return null;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const rows = await db
      .select(baseSelect)
      .from(products)
      .innerJoin(brands, eq(products.brandId, brands.id))
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .orderBy(desc(products.createdAt));

    const imgMap = await imagesByProduct(rows.map((r) => r.id));
    return rows.map((r) => rowToProduct(r, imgMap.get(r.id) ?? []));
  } catch (err) {
    console.error("getAllProducts failed:", err);
    return [];
  }
}

export async function getCategories(): Promise<CategoryItem[]> {
  try {
    const rows = await db
      .select({
        name: categories.name,
        displayOrder: categories.displayOrder,
        count: sql<number>`count(${products.id})::int`,
        image: sql<string | null>`(
          select pi.url from ${productImages} pi
          where pi.product_id = (
            select p2.id from ${products} p2
            where p2.category_id = ${categories.id}
            order by p2.created_at desc limit 1
          )
          order by pi.position asc limit 1
        )`,
      })
      .from(categories)
      .leftJoin(products, eq(products.categoryId, categories.id))
      .groupBy(categories.id)
      .orderBy(asc(categories.displayOrder));

    return rows
      .filter((r) => r.count > 0)
      .map((r) => ({
        name: r.name,
        image: r.image ?? "",
        href: `/collections/all-bags?bagType=${encodeURIComponent(r.name)}`,
        count: r.count,
      }));
  } catch (err) {
    console.error("getCategories failed:", err);
    return [];
  }
}

export async function getFacets(): Promise<FilterGroup[]> {
  try {
    async function countByColumn(
      column: typeof products.color | typeof products.condition | typeof products.material
    ): Promise<FilterGroup["options"]> {
      const rows = await db
        .select({ label: column, count: sql<number>`count(*)::int` })
        .from(products)
        .groupBy(column)
        .orderBy(desc(sql`count(*)`));
      return rows.map((r) => ({ label: r.label, count: r.count }));
    }

    const brandRows = await db
      .select({ label: brands.name, count: sql<number>`count(${products.id})::int` })
      .from(brands)
      .leftJoin(products, eq(products.brandId, brands.id))
      .groupBy(brands.name)
      .orderBy(desc(sql`count(${products.id})`));

    const bagTypeRows = await db
      .select({ label: categories.name, count: sql<number>`count(${products.id})::int` })
      .from(categories)
      .leftJoin(products, eq(products.categoryId, categories.id))
      .groupBy(categories.name)
      .orderBy(desc(sql`count(${products.id})`));

    const priceTiers: { label: string; min: number; max?: number }[] = [
      { label: "Under $500", min: 0, max: 500 },
      { label: "$500 – $1,000", min: 500, max: 1000 },
      { label: "$1,000 – $2,500", min: 1000, max: 2500 },
      { label: "$2,500 – $5,000", min: 2500, max: 5000 },
      { label: "Over $5,000", min: 5000 },
    ];

    const priceOptions: FilterGroup["options"] = [];
    for (const { label, min, max } of priceTiers) {
      const cond = max !== undefined
        ? and(gte(products.price, min), lte(products.price, max - 1))
        : gte(products.price, min);
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(products)
        .where(cond);
      priceOptions.push({ label, count });
    }

    const [brandFacet, conditionFacet, bagTypeFacet, colorFacet, materialFacet] =
      [
        brandRows.filter((r) => r.count > 0),
        await countByColumn(products.condition),
        bagTypeRows.filter((r) => r.count > 0),
        await countByColumn(products.color),
        await countByColumn(products.material),
      ];

    return [
      { name: "Designers", options: brandFacet },
      { name: "Condition", options: conditionFacet },
      { name: "Bag Type", options: bagTypeFacet },
      { name: "Price", options: priceOptions },
      { name: "Color", options: colorFacet },
      { name: "Material", options: materialFacet },
    ];
  } catch (err) {
    console.error("getFacets failed:", err);
    return [];
  }
}
