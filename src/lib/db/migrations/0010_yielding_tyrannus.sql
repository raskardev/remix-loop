ALTER TABLE `cart_products` ADD `product_variant_size_id` text NOT NULL REFERENCES product_variant_sizes(id);--> statement-breakpoint
ALTER TABLE `cart_products` DROP COLUMN `product_variant_id`;