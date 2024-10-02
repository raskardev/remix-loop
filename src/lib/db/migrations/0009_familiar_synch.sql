CREATE TABLE `product_variant_sizes` (
	`id` text PRIMARY KEY DEFAULT (uuid()) NOT NULL,
	`product_variant_id` text NOT NULL,
	`size_id` text NOT NULL,
	`stock` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`size_id`) REFERENCES `sizes`(`id`) ON UPDATE no action ON DELETE no action
);
