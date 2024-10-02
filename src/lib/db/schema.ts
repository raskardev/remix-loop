import { relations, sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersSchema = sqliteTable("users", {
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

export const categoriesSchema = sqliteTable("categories", {
  id: text("id").default(sql`(uuid())`).primaryKey(),
  name: text("name", {
    length: 100,
  })
    .notNull()
    .unique(),
  parentId: text("parent_id"),
  active: integer("active", {
    mode: "boolean",
  }).default(false),
  slug: text("slug", {
    length: 50,
  }).notNull(),
});

export const productsSchema = sqliteTable("products", {
  id: text("id").default(sql`(uuid())`).primaryKey(),
  name: text("name", {
    length: 50,
  })
    .notNull()
    .unique(),
  description: text("description", {
    length: 200,
  }).notNull(),
  categoryId: text("category_id")
    .references(() => categoriesSchema.id)
    .notNull(),
  slug: text("slug", {
    length: 50,
  })
    .notNull()
    .default(""),
  targetGender: text("target_gender", {
    length: 1,
    enum: ["M", "F", "U"],
  })
    .notNull()
    .default("U"),
  price: real("price").notNull(),
  active: integer("active", {
    mode: "boolean",
  }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const sizesSchema = sqliteTable("sizes", {
  id: text("id").default(sql`(uuid())`).primaryKey(),
  name: text("name", {
    length: 100,
  })
    .notNull()
    .unique(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const colorsSchema = sqliteTable("colors", {
  id: text("id").default(sql`(uuid())`).primaryKey(),
  name: text("name", {
    length: 100,
  })
    .notNull()
    .unique(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const productVariantsSchema = sqliteTable("product_variants", {
  id: text("id").default(sql`(uuid())`).primaryKey(),
  productId: text("product_id").references(() => productsSchema.id),
  sizeId: text("size_id").references(() => sizesSchema.id),
  colorId: text("color_id").references(() => colorsSchema.id),
  stock: integer("stock").notNull(),
  // price: real("price").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const wishlistsSchema = sqliteTable("wishlists", {
  id: text("id").default(sql`(uuid())`).primaryKey(),
  userId: text("user_id").references(() => usersSchema.id),
  productVariantId: text("product_variant_id")
    .references(() => productVariantsSchema.id)
    .notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const shippingAddressesSchema = sqliteTable("shipping_addresses", {
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
  userId: text("user_id").references(() => usersSchema.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const cartsSchema = sqliteTable("carts", {
  id: text("id").default(sql`(uuid())`).primaryKey(),
  userId: text("user_id").references(() => usersSchema.id),
});

export const cartProductsSchema = sqliteTable("cart_products", {
  id: text("id").default(sql`(uuid())`).primaryKey(),
  cartId: text("cart_id")
    .references(() => cartsSchema.id)
    .notNull(),
  productVariantId: text("product_variant_id").references(
    () => productVariantsSchema.id,
  ),
  quantity: integer("quantity").default(1).notNull(),
});

export const ordersSchema = sqliteTable("orders", {
  id: text("id").default(sql`(uuid())`).primaryKey(),
  status: text("status").notNull(),
  userId: text("user_id").references(() => usersSchema.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const orderItemsSchema = sqliteTable("order_items", {
  id: text("id").default(sql`(uuid())`).primaryKey(),
  quantity: integer("quantity").default(1).notNull(),
  orderId: text("order_id").references(() => ordersSchema.id),
  productVariantId: text("product_variant_id").references(
    () => productVariantsSchema.id,
  ),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const paymentDetailsSchema = sqliteTable("payment_details", {
  id: text("id").default(sql`(uuid())`).primaryKey(),
  amount: real("amount").notNull(),
  orderId: text("order_id").references(() => ordersSchema.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const productRelations = relations(productsSchema, ({ one }) => ({
  category: one(categoriesSchema, {
    fields: [productsSchema.categoryId],
    references: [categoriesSchema.id],
  }),
}));

export const categoryRelations = relations(
  categoriesSchema,
  ({ one, many }) => ({
    categoryProducts: many(productsSchema),
    parent: one(categoriesSchema, {
      fields: [categoriesSchema.parentId],
      references: [categoriesSchema.id],
    }),
  }),
);

export const sizeRelations = relations(sizesSchema, ({ many }) => ({
  productVariants: many(productVariantsSchema),
}));

export const colorRelations = relations(colorsSchema, ({ many }) => ({
  productVariants: many(productVariantsSchema),
}));

export const productVariantRelations = relations(
  productVariantsSchema,
  ({ one }) => ({
    product: one(productsSchema, {
      fields: [productVariantsSchema.productId],
      references: [productsSchema.id],
    }),
    size: one(sizesSchema, {
      fields: [productVariantsSchema.sizeId],
      references: [sizesSchema.id],
    }),
    color: one(colorsSchema, {
      fields: [productVariantsSchema.colorId],
      references: [colorsSchema.id],
    }),
  }),
);

export const orderRelations = relations(ordersSchema, ({ one }) => ({
  user: one(usersSchema, {
    fields: [ordersSchema.userId],
    references: [usersSchema.id],
  }),
}));

export const orderItemsRelations = relations(
  orderItemsSchema,
  ({ one, many }) => ({
    order: one(ordersSchema, {
      fields: [orderItemsSchema.orderId],
      references: [ordersSchema.id],
    }),
  }),
);

export const shippingAddressesRelations = relations(
  shippingAddressesSchema,
  ({ one }) => ({
    user: one(usersSchema, {
      fields: [shippingAddressesSchema.userId],
      references: [usersSchema.id],
    }),
  }),
);

export const paymentDetailsRelations = relations(
  paymentDetailsSchema,
  ({ one }) => ({
    order: one(ordersSchema, {
      fields: [paymentDetailsSchema.orderId],
      references: [ordersSchema.id],
    }),
  }),
);

export const cartsRelations = relations(cartsSchema, ({ one }) => ({
  user: one(usersSchema, {
    fields: [cartsSchema.userId],
    references: [usersSchema.id],
  }),
}));

export const cartProductsRelations = relations(
  cartProductsSchema,
  ({ one }) => ({
    cart: one(cartsSchema, {
      fields: [cartProductsSchema.id],
      references: [cartsSchema.id],
    }),
  }),
);

export const usersRelations = relations(usersSchema, ({ many }) => ({
  wishlists: many(wishlistsSchema),
}));

export const wishlistsRelations = relations(wishlistsSchema, ({ one }) => ({
  user: one(usersSchema, {
    fields: [wishlistsSchema.userId],
    references: [usersSchema.id],
  }),
}));

export type User = typeof usersSchema.$inferSelect;
export type NewUser = typeof usersSchema.$inferInsert;
export type Category = typeof categoriesSchema.$inferSelect;
export type NewCategory = typeof categoriesSchema.$inferInsert;
export type Product = typeof productsSchema.$inferSelect;
export type NewProduct = typeof productsSchema.$inferInsert;
export type ProductVariant = typeof productVariantsSchema.$inferSelect;
export type NewProductVariant = typeof productVariantsSchema.$inferInsert;
