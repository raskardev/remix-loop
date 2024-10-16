CREATE TABLE `cart_products` (
	`id` text PRIMARY KEY NOT NULL,
	`cart_id` text NOT NULL,
	`product_variant_size_id` text NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`cart_id`) REFERENCES `carts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_variant_size_id`) REFERENCES `product_variant_sizes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `carts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(100) NOT NULL,
	`parent_id` text,
	`active` integer DEFAULT false,
	`slug` text(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `colors` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(100) NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`order_id` text,
	`product_variant_size_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_variant_size_id`) REFERENCES `product_variant_sizes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`amount` real NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`user_id` text,
	`shipping_address_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`shipping_address_id`) REFERENCES `shipping_addresses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `product_variant_sizes` (
	`id` text PRIMARY KEY NOT NULL,
	`product_variant_id` text NOT NULL,
	`size_id` text NOT NULL,
	`stock` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`size_id`) REFERENCES `sizes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `product_variants` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text,
	`color_id` text,
	`image_url` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`color_id`) REFERENCES `colors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(50) NOT NULL,
	`description` text(200) NOT NULL,
	`category_id` text NOT NULL,
	`slug` text(50) DEFAULT '' NOT NULL,
	`target_gender` text(1) NOT NULL,
	`price` real NOT NULL,
	`active` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `shipping_addresses` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(100) NOT NULL,
	`surnames` text(200) NOT NULL,
	`country` text(50) NOT NULL,
	`phone_number` text(50) NOT NULL,
	`address` text(50) NOT NULL,
	`additional_address` text(50) NOT NULL,
	`remarks` text(200),
	`postal_code` text(100) NOT NULL,
	`population` text(100) NOT NULL,
	`province` text(100) NOT NULL,
	`user_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sizes` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(100) NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(100) NOT NULL,
	`email` text(255) NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `wishlists` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`product_variant_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `colors_name_unique` ON `colors` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `products_name_unique` ON `products` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `sizes_name_unique` ON `sizes` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);