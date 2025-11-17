PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_settings` (
	`id` integer PRIMARY KEY DEFAULT 0 NOT NULL,
	`preferred_name` text NOT NULL,
	`api_key` text,
	`api_key_type` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_settings`("id", "preferred_name", "api_key", "api_key_type", "created_at", "updated_at") SELECT "id", "preferred_name", "api_key", "api_key_type", "created_at", "updated_at" FROM `settings`;--> statement-breakpoint
DROP TABLE `settings`;--> statement-breakpoint
ALTER TABLE `__new_settings` RENAME TO `settings`;--> statement-breakpoint
PRAGMA foreign_keys=ON;