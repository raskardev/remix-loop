import { relations, sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").default(sql`(uuid())`).primaryKey(),
  name: text("name", {
    length: 100,
  }).notNull(),
  email: text("email", {
    length: 255,
  })
    .notNull()
    .unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const categories = sqliteTable("categories", {
  id: text("id").default(sql`(uuid())`).primaryKey(),
  name: text("name", {
    length: 100,
  })
    .notNull()
    .unique(),
  slug: text("slug", {
    length: 50,
  }).notNull(),
});

export const products = sqliteTable("products", {
  id: text("id").default(sql`(uuid())`).primaryKey(),
  name: text("name", {
    length: 50,
  })
    .notNull()
    .unique(),
  description: text("description", {
    length: 200,
  }).notNull(),
  categoryId: text("category_id").references(() => categories.id),
  price: real("price").notNull(),
  stock: integer("stock").notNull(),
  active: integer("active", {
    mode: "boolean",
  }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const wishlists = sqliteTable("wishlists", {
  id: text("id").default(sql`(uuid())`).primaryKey(),
  userId: text("user_id").references(() => users.id),
  productId: text("product_id").references(() => products.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const shippingAddresses = sqliteTable("shipping_addresses", {
  id: text("id").default(sql`(uuid())`).primaryKey(),
  name: text("name", {
    length: 100,
  }).notNull(),
  surnames: text("surnames", {
    length: 200,
  }).notNull(),
  country: text("country", {
    length: 50,
  }).notNull(),
  phoneNumber: text("phone_number", {
    length: 50,
  }).notNull(),
  address: text("address", {
    length: 50,
  }).notNull(),
  additionalAddress: text("additional_address", {
    length: 50,
  }).notNull(),
  remarks: text("remarks", {
    length: 200,
  }),
  postalCode: text("postal_code", {
    length: 100,
  }).notNull(),
  population: text("population", {
    length: 100,
  }).notNull(),
  province: text("province", {
    length: 100,
  }).notNull(),
  userId: text("user_id").references(() => users.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const carts = sqliteTable("carts", {
  id: text("id").default(sql`(uuid())`).primaryKey(),
  userId: text("user_id").references(() => users.id),
});

export const cartProducts = sqliteTable("cart_products", {
  id: text("id").default(sql`(uuid())`).primaryKey(),
  cartId: text("cart_id").references(() => carts.id),
  productId: text("product_id").references(() => products.id),
  quantity: integer("quantity").default(1).notNull(),
});

export const orders = sqliteTable("orders", {
  id: text("id").default(sql`(uuid())`).primaryKey(),
  status: text("status").notNull(),
  userId: text("user_id").references(() => users.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const orderItems = sqliteTable("order_items", {
  id: text("id").default(sql`(uuid())`).primaryKey(),
  quantity: integer("quantity").default(1).notNull(),
  orderId: text("order_id").references(() => orders.id),
  productId: text("product_id").references(() => products.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const paymentDetails = sqliteTable("payment_details", {
  id: text("id").default(sql`(uuid())`).primaryKey(),
  amount: real("amount").notNull(),
  orderId: text("order_id").references(() => orders.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  categoryProducts: many(products),
}));

export const wishlistsRelations = relations(wishlists, ({ one, many }) => ({
  user: one(users, {
    fields: [wishlists.userId],
    references: [users.id],
  }),
}));

export const cartsRelations = relations(carts, ({ one }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
}));

export const cartProductsRelations = relations(cartProducts, ({ one }) => ({
  cart: one(carts, {
    fields: [cartProducts.id],
    references: [carts.id],
  }),
}));

export const orderRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));

export const orderItemsRelations = relations(orderItems, ({ one, many }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));

export const shippingAddressesRelations = relations(
  shippingAddresses,
  ({ one }) => ({
    user: one(users, {
      fields: [shippingAddresses.userId],
      references: [users.id],
    }),
  }),
);

export const paymentDetailsRelations = relations(paymentDetails, ({ one }) => ({
  order: one(orders, {
    fields: [paymentDetails.orderId],
    references: [orders.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
