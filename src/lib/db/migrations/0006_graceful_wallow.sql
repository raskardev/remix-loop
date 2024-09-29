ALTER TABLE `wishlists` ADD `product_variant_id` text NOT NULL REFERENCES product_variants(id);--> statement-breakpoint
ALTER TABLE `wishlists` DROP COLUMN `product_id`;