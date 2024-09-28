ALTER TABLE `product_variants` ADD `image_url` text NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `target_gender` text(1) DEFAULT 'U' NOT NULL;