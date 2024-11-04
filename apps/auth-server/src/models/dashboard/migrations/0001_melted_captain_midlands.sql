ALTER TABLE "tallyGroups" ADD COLUMN "natureOfGroup" varchar(200);--> statement-breakpoint
ALTER TABLE "tempTallyGroups" ADD COLUMN "natureOfGroup" varchar(200);--> statement-breakpoint
ALTER TABLE "tallyGroups" DROP COLUMN IF EXISTS "natureofGroup";--> statement-breakpoint
ALTER TABLE "tempTallyGroups" DROP COLUMN IF EXISTS "natureofGroup";