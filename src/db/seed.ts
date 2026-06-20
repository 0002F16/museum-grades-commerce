import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { seedProducts } from "../lib/seed-data";
import { slugify } from "../lib/slug";
import { brands, categories, products, productImages } from "./schema";

// Standalone connection (does not import the server-only app client).
const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL must be set to run the seed.");
}

const client = postgres(url, { prepare: false });
const db = drizzle(client, { schema: { brands, categories, products, productImages } });

// Display order for bag-type categories (only categories with ≥1 product show).
const CATEGORY_ORDER = [
  "Crossbody Bags",
  "Shoulder Bags",
  "Handbags",
  "Totes",
  "Backpacks",
  "Clutches",
  "Bucket Bags",
  "Belt Bags",
  "Hobo Bags",
  "Satchels",
];

async function seed() {
  console.log(`Seeding ${seedProducts.length} products...`);

  // 1. Brands
  const brandNames = [...new Set(seedProducts.map((p) => p.brand))];
  const brandIdByName = new Map<string, number>();
  for (const name of brandNames) {
    const [row] = await db
      .insert(brands)
      .values({ name, slug: slugify(name) })
      .onConflictDoUpdate({
        target: brands.name,
        set: { slug: slugify(name) },
      })
      .returning();
    brandIdByName.set(name, row.id);
  }
  console.log(`  ${brandNames.length} brands`);

  // 2. Categories (bag types)
  const categoryNames = [...new Set(seedProducts.map((p) => p.bagType))];
  const categoryIdByName = new Map<string, number>();
  for (const name of categoryNames) {
    const order = CATEGORY_ORDER.indexOf(name);
    const displayOrder = order === -1 ? 999 : order;
    const [row] = await db
      .insert(categories)
      .values({ name, slug: slugify(name), displayOrder })
      .onConflictDoUpdate({
        target: categories.name,
        set: { slug: slugify(name), displayOrder },
      })
      .returning();
    categoryIdByName.set(name, row.id);
  }
  console.log(`  ${categoryNames.length} categories`);

  // 3. Products + images
  for (const p of seedProducts) {
    await db
      .insert(products)
      .values({
        id: p.id,
        slug: p.slug,
        brandId: brandIdByName.get(p.brand)!,
        categoryId: categoryIdByName.get(p.bagType)!,
        name: p.name,
        price: p.price,
        estRetail: p.estRetail,
        savingsPercent: p.savingsPercent,
        condition: p.condition,
        color: p.color,
        material: p.material,
        description: p.description,
        itemNumber: p.itemNumber,
        exterior: p.exterior,
        hardware: p.hardware,
        interior: p.interior,
        comesWith: p.comesWith,
        sizeBase: p.size.base,
        sizeHeight: p.size.height,
        sizeDepth: p.size.depth,
        sizeDrop: p.size.drop,
      })
      .onConflictDoUpdate({
        target: products.id,
        set: {
          slug: p.slug,
          brandId: brandIdByName.get(p.brand)!,
          categoryId: categoryIdByName.get(p.bagType)!,
          name: p.name,
          price: p.price,
          estRetail: p.estRetail,
          savingsPercent: p.savingsPercent,
          condition: p.condition,
          color: p.color,
          material: p.material,
          description: p.description,
          itemNumber: p.itemNumber,
          exterior: p.exterior,
          hardware: p.hardware,
          interior: p.interior,
          comesWith: p.comesWith,
          sizeBase: p.size.base,
          sizeHeight: p.size.height,
          sizeDepth: p.size.depth,
          sizeDrop: p.size.drop,
        },
      });

    // Delete + reinsert images so re-runs stay clean.
    await db.delete(productImages).where(eq(productImages.productId, p.id));
    if (p.images.length > 0) {
      await db.insert(productImages).values(
        p.images.map((urlValue, i) => ({
          productId: p.id,
          url: urlValue,
          position: i,
        }))
      );
    }
  }
  console.log(`  ${seedProducts.length} products + images`);
  console.log("Seed complete.");
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => client.end());
