ALTER TABLE "report" ALTER COLUMN "tables" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "report" ALTER COLUMN "tables" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "report" ALTER COLUMN "columns" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "report" ALTER COLUMN "columns" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "report" ALTER COLUMN "filters" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "report" ALTER COLUMN "filters" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "report" ALTER COLUMN "groupBy" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "report" ALTER COLUMN "groupBy" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "report" ALTER COLUMN "conditions" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "report" ALTER COLUMN "conditions" SET NOT NULL;