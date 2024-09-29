ALTER TABLE `products` ADD `slug` text(50) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `product_variants` DROP COLUMN `slug`;