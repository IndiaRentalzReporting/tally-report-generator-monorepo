ALTER TABLE "tallyCompanies" DROP CONSTRAINT "tallyCompanies_masterID_unique";--> statement-breakpoint
ALTER TABLE "tempTallyCompanies" DROP CONSTRAINT "tempTallyCompanies_masterID_unique";--> statement-breakpoint
ALTER TABLE "tallyGroups" DROP CONSTRAINT "tallyGroups_masterID_unique";--> statement-breakpoint
ALTER TABLE "tempTallyGroups" DROP CONSTRAINT "tempTallyGroups_masterID_unique";--> statement-breakpoint
ALTER TABLE "tallyInventoryVouchers" DROP CONSTRAINT "tallyInventoryVouchers_masterID_unique";--> statement-breakpoint
ALTER TABLE "tempTallyInventoryVouchers" DROP CONSTRAINT "tempTallyInventoryVouchers_masterID_unique";--> statement-breakpoint
ALTER TABLE "tallyLedgers" DROP CONSTRAINT "tallyLedgers_masterID_unique";--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" DROP CONSTRAINT "tempTallyLedgers_masterID_unique";--> statement-breakpoint
ALTER TABLE "tallyStockCategories" DROP CONSTRAINT "tallyStockCategories_masterID_unique";--> statement-breakpoint
ALTER TABLE "tempTallyStockCategories" DROP CONSTRAINT "tempTallyStockCategories_masterID_unique";--> statement-breakpoint
ALTER TABLE "tallyStockGroups" DROP CONSTRAINT "tallyStockGroups_masterID_unique";--> statement-breakpoint
ALTER TABLE "tempTallyStockGroups" DROP CONSTRAINT "tempTallyStockGroups_masterID_unique";--> statement-breakpoint
ALTER TABLE "tallyStockItems" DROP CONSTRAINT "tallyStockItems_masterID_unique";--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" DROP CONSTRAINT "tempTallyStockItems_masterID_unique";--> statement-breakpoint
ALTER TABLE "tallyUnits" DROP CONSTRAINT "tallyUnits_masterID_unique";--> statement-breakpoint
ALTER TABLE "tempTallyUnits" DROP CONSTRAINT "tempTallyUnits_masterID_unique";--> statement-breakpoint
ALTER TABLE "tallyVouchers" DROP CONSTRAINT "tallyVouchers_masterID_unique";--> statement-breakpoint
ALTER TABLE "tempTallyVouchers" DROP CONSTRAINT "tempTallyVouchers_masterID_unique";--> statement-breakpoint
ALTER TABLE "tallyCompanies" ADD COLUMN "masterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyCompanies" ADD COLUMN "alterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyCompanies" ADD COLUMN "masterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyCompanies" ADD COLUMN "alterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyGroups" ADD COLUMN "masterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyGroups" ADD COLUMN "alterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyGroups" ADD COLUMN "masterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyGroups" ADD COLUMN "alterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyInventoryVouchers" ADD COLUMN "masterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyInventoryVouchers" ADD COLUMN "alterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyInventoryVouchers" ADD COLUMN "masterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyInventoryVouchers" ADD COLUMN "alterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyLedgers" ADD COLUMN "masterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyLedgers" ADD COLUMN "alterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ADD COLUMN "masterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ADD COLUMN "alterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyStockCategories" ADD COLUMN "masterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyStockCategories" ADD COLUMN "alterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyStockCategories" ADD COLUMN "masterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyStockCategories" ADD COLUMN "alterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyStockGroups" ADD COLUMN "masterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyStockGroups" ADD COLUMN "alterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyStockGroups" ADD COLUMN "masterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyStockGroups" ADD COLUMN "alterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ADD COLUMN "masterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ADD COLUMN "alterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD COLUMN "masterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD COLUMN "alterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyUnits" ADD COLUMN "masterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyUnits" ADD COLUMN "alterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyUnits" ADD COLUMN "masterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyUnits" ADD COLUMN "alterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyVouchers" ADD COLUMN "masterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyVouchers" ADD COLUMN "alterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyVouchers" ADD COLUMN "masterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyVouchers" ADD COLUMN "alterId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyCompanies" DROP COLUMN IF EXISTS "masterID";--> statement-breakpoint
ALTER TABLE "tallyCompanies" DROP COLUMN IF EXISTS "alterID";--> statement-breakpoint
ALTER TABLE "tempTallyCompanies" DROP COLUMN IF EXISTS "masterID";--> statement-breakpoint
ALTER TABLE "tempTallyCompanies" DROP COLUMN IF EXISTS "alterID";--> statement-breakpoint
ALTER TABLE "tallyGroups" DROP COLUMN IF EXISTS "masterID";--> statement-breakpoint
ALTER TABLE "tallyGroups" DROP COLUMN IF EXISTS "alterID";--> statement-breakpoint
ALTER TABLE "tempTallyGroups" DROP COLUMN IF EXISTS "masterID";--> statement-breakpoint
ALTER TABLE "tempTallyGroups" DROP COLUMN IF EXISTS "alterID";--> statement-breakpoint
ALTER TABLE "tallyInventoryVouchers" DROP COLUMN IF EXISTS "masterID";--> statement-breakpoint
ALTER TABLE "tallyInventoryVouchers" DROP COLUMN IF EXISTS "alterID";--> statement-breakpoint
ALTER TABLE "tempTallyInventoryVouchers" DROP COLUMN IF EXISTS "masterID";--> statement-breakpoint
ALTER TABLE "tempTallyInventoryVouchers" DROP COLUMN IF EXISTS "alterID";--> statement-breakpoint
ALTER TABLE "tallyLedgers" DROP COLUMN IF EXISTS "masterID";--> statement-breakpoint
ALTER TABLE "tallyLedgers" DROP COLUMN IF EXISTS "alterID";--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" DROP COLUMN IF EXISTS "masterID";--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" DROP COLUMN IF EXISTS "alterID";--> statement-breakpoint
ALTER TABLE "tallyStockCategories" DROP COLUMN IF EXISTS "masterID";--> statement-breakpoint
ALTER TABLE "tallyStockCategories" DROP COLUMN IF EXISTS "alterID";--> statement-breakpoint
ALTER TABLE "tempTallyStockCategories" DROP COLUMN IF EXISTS "masterID";--> statement-breakpoint
ALTER TABLE "tempTallyStockCategories" DROP COLUMN IF EXISTS "alterID";--> statement-breakpoint
ALTER TABLE "tallyStockGroups" DROP COLUMN IF EXISTS "masterID";--> statement-breakpoint
ALTER TABLE "tallyStockGroups" DROP COLUMN IF EXISTS "alterID";--> statement-breakpoint
ALTER TABLE "tempTallyStockGroups" DROP COLUMN IF EXISTS "masterID";--> statement-breakpoint
ALTER TABLE "tempTallyStockGroups" DROP COLUMN IF EXISTS "alterID";--> statement-breakpoint
ALTER TABLE "tallyStockItems" DROP COLUMN IF EXISTS "masterID";--> statement-breakpoint
ALTER TABLE "tallyStockItems" DROP COLUMN IF EXISTS "alterID";--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" DROP COLUMN IF EXISTS "masterID";--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" DROP COLUMN IF EXISTS "alterID";--> statement-breakpoint
ALTER TABLE "tallyUnits" DROP COLUMN IF EXISTS "masterID";--> statement-breakpoint
ALTER TABLE "tallyUnits" DROP COLUMN IF EXISTS "alterID";--> statement-breakpoint
ALTER TABLE "tempTallyUnits" DROP COLUMN IF EXISTS "masterID";--> statement-breakpoint
ALTER TABLE "tempTallyUnits" DROP COLUMN IF EXISTS "alterID";--> statement-breakpoint
ALTER TABLE "tallyVouchers" DROP COLUMN IF EXISTS "masterID";--> statement-breakpoint
ALTER TABLE "tallyVouchers" DROP COLUMN IF EXISTS "alterID";--> statement-breakpoint
ALTER TABLE "tempTallyVouchers" DROP COLUMN IF EXISTS "masterID";--> statement-breakpoint
ALTER TABLE "tempTallyVouchers" DROP COLUMN IF EXISTS "alterID";--> statement-breakpoint
ALTER TABLE "tallyCompanies" ADD CONSTRAINT "tallyCompanies_masterId_unique" UNIQUE("masterId");--> statement-breakpoint
ALTER TABLE "tempTallyCompanies" ADD CONSTRAINT "tempTallyCompanies_masterId_unique" UNIQUE("masterId");--> statement-breakpoint
ALTER TABLE "tallyGroups" ADD CONSTRAINT "tallyGroups_masterId_unique" UNIQUE("masterId");--> statement-breakpoint
ALTER TABLE "tempTallyGroups" ADD CONSTRAINT "tempTallyGroups_masterId_unique" UNIQUE("masterId");--> statement-breakpoint
ALTER TABLE "tallyInventoryVouchers" ADD CONSTRAINT "tallyInventoryVouchers_masterId_unique" UNIQUE("masterId");--> statement-breakpoint
ALTER TABLE "tempTallyInventoryVouchers" ADD CONSTRAINT "tempTallyInventoryVouchers_masterId_unique" UNIQUE("masterId");--> statement-breakpoint
ALTER TABLE "tallyLedgers" ADD CONSTRAINT "tallyLedgers_masterId_unique" UNIQUE("masterId");--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ADD CONSTRAINT "tempTallyLedgers_masterId_unique" UNIQUE("masterId");--> statement-breakpoint
ALTER TABLE "tallyStockCategories" ADD CONSTRAINT "tallyStockCategories_masterId_unique" UNIQUE("masterId");--> statement-breakpoint
ALTER TABLE "tempTallyStockCategories" ADD CONSTRAINT "tempTallyStockCategories_masterId_unique" UNIQUE("masterId");--> statement-breakpoint
ALTER TABLE "tallyStockGroups" ADD CONSTRAINT "tallyStockGroups_masterId_unique" UNIQUE("masterId");--> statement-breakpoint
ALTER TABLE "tempTallyStockGroups" ADD CONSTRAINT "tempTallyStockGroups_masterId_unique" UNIQUE("masterId");--> statement-breakpoint
ALTER TABLE "tallyStockItems" ADD CONSTRAINT "tallyStockItems_masterId_unique" UNIQUE("masterId");--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD CONSTRAINT "tempTallyStockItems_masterId_unique" UNIQUE("masterId");--> statement-breakpoint
ALTER TABLE "tallyUnits" ADD CONSTRAINT "tallyUnits_masterId_unique" UNIQUE("masterId");--> statement-breakpoint
ALTER TABLE "tempTallyUnits" ADD CONSTRAINT "tempTallyUnits_masterId_unique" UNIQUE("masterId");--> statement-breakpoint
ALTER TABLE "tallyVouchers" ADD CONSTRAINT "tallyVouchers_masterId_unique" UNIQUE("masterId");--> statement-breakpoint
ALTER TABLE "tempTallyVouchers" ADD CONSTRAINT "tempTallyVouchers_masterId_unique" UNIQUE("masterId");