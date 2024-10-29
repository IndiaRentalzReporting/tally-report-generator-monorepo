ALTER TABLE "tallyStockItems" ADD COLUMN "name" varchar(500) NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD COLUMN "name" varchar(500) NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyStockItems" DROP COLUMN IF EXISTS "stockItemName";--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" DROP COLUMN IF EXISTS "stockItemName";