import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Source of truth for the catalogue. This file will grow in later phases
// (auth tables, carts/cart_items, orders/order_items).

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  displayOrder: integer("display_order").notNull().default(999),
});

export const products = pgTable(
  "products",
  {
    // Natural key = Fashionphile item number (already unique + used as React key).
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    brandId: integer("brand_id")
      .notNull()
      .references(() => brands.id),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id),
    name: text("name").notNull(),
    price: integer("price").notNull(),
    estRetail: integer("est_retail").notNull(),
    savingsPercent: integer("savings_percent").notNull(),
    condition: text("condition").notNull(),
    color: text("color").notNull(),
    material: text("material").notNull(),
    description: text("description").notNull(),
    itemNumber: text("item_number").notNull(),
    exterior: text("exterior").notNull(),
    hardware: text("hardware").notNull(),
    interior: text("interior").notNull(),
    comesWith: text("comes_with").notNull(),
    sizeBase: text("size_base").notNull(),
    sizeHeight: text("size_height").notNull(),
    sizeDepth: text("size_depth").notNull(),
    sizeDrop: text("size_drop").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("products_slug_idx").on(t.slug),
    index("products_brand_id_idx").on(t.brandId),
    index("products_category_id_idx").on(t.categoryId),
    index("products_price_idx").on(t.price),
  ]
);

export const productImages = pgTable(
  "product_images",
  {
    id: serial("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    position: integer("position").notNull().default(0),
  },
  (t) => [index("product_images_product_id_idx").on(t.productId)]
);

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, { fields: [products.brandId], references: [brands.id] }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

// ─── Auth tables (Better Auth) ────────────────────────────────────────────────

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// ─── Cart (per-user, DB-backed) ───────────────────────────────────────────────
// Stores only references (userId + productId). Display fields are re-derived by
// joining to products/brands/product_images. Items are one-of-one (no quantity).

export const cartItems = pgTable(
  "cart_items",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("cart_items_user_product_idx").on(t.userId, t.productId),
    index("cart_items_user_id_idx").on(t.userId),
  ]
);

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(user, { fields: [cartItems.userId], references: [user.id] }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

// ─── Orders ───────────────────────────────────────────────────────────────────

export const orders = pgTable(
  "orders",
  {
    id: text("id").primaryKey(), // Square payment ID
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("completed"), // completed | refunded
    subtotalAmount: integer("subtotal_amount").notNull(), // cents
    totalAmount: integer("total_amount").notNull(),       // cents
    currency: text("currency").notNull().default("USD"),
    squarePaymentId: text("square_payment_id").notNull().unique(),
    squareReceiptUrl: text("square_receipt_url"),
    // Per-order shipping snapshot (nullable — legacy orders predate this).
    shippingName: text("shipping_name"),
    shippingPhone: text("shipping_phone"),
    shippingLine1: text("shipping_line1"),
    shippingLine2: text("shipping_line2"),
    shippingCity: text("shipping_city"),
    shippingState: text("shipping_state"),
    shippingPostalCode: text("shipping_postal_code"),
    shippingCountry: text("shipping_country"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("orders_user_id_idx").on(t.userId)]
);

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: text("product_id").notNull(), // kept for reference; product may be sold
    name: text("name").notNull(),
    brand: text("brand").notNull(),
    price: integer("price").notNull(), // cents — snapshot at purchase time
    imageUrl: text("image_url"),
    condition: text("condition").notNull(),
    slug: text("slug").notNull(),
  },
  (t) => [index("order_items_order_id_idx").on(t.orderId)]
);

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(user, { fields: [orders.userId], references: [user.id] }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
}));
