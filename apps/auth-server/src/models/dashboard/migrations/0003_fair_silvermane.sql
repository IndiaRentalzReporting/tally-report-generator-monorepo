CREATE TABLE IF NOT EXISTS "tallyInventoryVouchers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterID" integer NOT NULL,
	"alterID" integer NOT NULL,
	"voucherTypeName" varchar(255),
	"date" date,
	"voucherNumber" varchar(512),
	"stockItemName" varchar(512),
	"stockItemMasterId" integer,
	"billedQty" integer,
	"actualQty" integer,
	"inwardQty" integer,
	"outwardQty" integer,
	"discount" integer,
	"amount" double precision,
	"rate" double precision,
	CONSTRAINT "tallyInventoryVouchers_masterID_unique" UNIQUE("masterID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tempTallyInventoryVouchers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterID" integer NOT NULL,
	"alterID" integer NOT NULL,
	"voucherTypeName" varchar(255),
	"date" date,
	"voucherNumber" varchar(512),
	"stockItemName" varchar(512),
	"stockItemMasterId" integer,
	"billedQty" integer,
	"actualQty" integer,
	"inwardQty" integer,
	"outwardQty" integer,
	"discount" integer,
	"amount" double precision,
	"rate" double precision,
	CONSTRAINT "tempTallyInventoryVouchers_masterID_unique" UNIQUE("masterID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tallyUnits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterID" integer NOT NULL,
	"alterID" integer NOT NULL,
	"name" varchar(200),
	CONSTRAINT "tallyUnits_masterID_unique" UNIQUE("masterID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tempTallyUnits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterID" integer NOT NULL,
	"alterID" integer NOT NULL,
	"name" varchar(200),
	CONSTRAINT "tempTallyUnits_masterID_unique" UNIQUE("masterID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tallyVouchers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterID" integer NOT NULL,
	"alterID" integer NOT NULL,
	"voucherTypeName" varchar(255),
	"date" date,
	"voucherNumber" varchar(512),
	"narration" text,
	CONSTRAINT "tallyVouchers_masterID_unique" UNIQUE("masterID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tempTallyVouchers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterID" integer NOT NULL,
	"alterID" integer NOT NULL,
	"voucherTypeName" varchar(255),
	"date" date,
	"voucherNumber" varchar(512),
	"narration" text,
	CONSTRAINT "tempTallyVouchers_masterID_unique" UNIQUE("masterID")
);
--> statement-breakpoint
ALTER TABLE "tallyCompanies" ALTER COLUMN "companyMailName" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyCompanies" ALTER COLUMN "companyNumber" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyCompanies" ALTER COLUMN "companyMailName" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyCompanies" ALTER COLUMN "companyNumber" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyLedgers" ALTER COLUMN "aliasName" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "tallyLedgers" ALTER COLUMN "parent" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "tallyLedgers" ALTER COLUMN "parent" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyLedgers" ALTER COLUMN "mailingName" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "tallyLedgers" ALTER COLUMN "addressLine1" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "tallyLedgers" ALTER COLUMN "addressLine2" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "tallyLedgers" ALTER COLUMN "addressLine3" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "tallyLedgers" ALTER COLUMN "addressLine4" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "tallyLedgers" ALTER COLUMN "PANNo" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "tallyLedgers" ALTER COLUMN "contactPerson" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "tallyLedgers" ALTER COLUMN "mobile" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "tallyLedgers" ALTER COLUMN "phone" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "tallyLedgers" ALTER COLUMN "fax" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "tallyLedgers" ALTER COLUMN "email" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "tallyLedgers" ALTER COLUMN "emailCC" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "tallyLedgers" ALTER COLUMN "website" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "tallyLedgers" ALTER COLUMN "openingBalance" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ALTER COLUMN "aliasName" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ALTER COLUMN "parent" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ALTER COLUMN "parent" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ALTER COLUMN "mailingName" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ALTER COLUMN "addressLine1" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ALTER COLUMN "addressLine2" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ALTER COLUMN "addressLine3" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ALTER COLUMN "addressLine4" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ALTER COLUMN "PANNo" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ALTER COLUMN "contactPerson" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ALTER COLUMN "mobile" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ALTER COLUMN "phone" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ALTER COLUMN "fax" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ALTER COLUMN "email" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ALTER COLUMN "emailCC" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ALTER COLUMN "website" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ALTER COLUMN "openingBalance" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ALTER COLUMN "stockItemName" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "tallyStockItems" ALTER COLUMN "aliasName" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ALTER COLUMN "parent" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ALTER COLUMN "category" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ALTER COLUMN "openingBalance" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ALTER COLUMN "openingRate" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ALTER COLUMN "openingValue" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ALTER COLUMN "baseUnits" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ALTER COLUMN "stockItemName" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ALTER COLUMN "aliasName" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ALTER COLUMN "parent" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ALTER COLUMN "category" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ALTER COLUMN "openingBalance" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ALTER COLUMN "openingRate" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ALTER COLUMN "openingValue" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ALTER COLUMN "baseUnits" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyCompanies" ADD COLUMN "name" varchar(200) NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyCompanies" ADD COLUMN "GSTNumber" varchar(512);--> statement-breakpoint
ALTER TABLE "tempTallyCompanies" ADD COLUMN "name" varchar(200) NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyCompanies" ADD COLUMN "GSTNumber" varchar(512);--> statement-breakpoint
ALTER TABLE "tallyGroups" ADD COLUMN "name" varchar(200);--> statement-breakpoint
ALTER TABLE "tallyGroups" ADD COLUMN "parent" text;--> statement-breakpoint
ALTER TABLE "tempTallyGroups" ADD COLUMN "name" varchar(200);--> statement-breakpoint
ALTER TABLE "tempTallyGroups" ADD COLUMN "parent" text;--> statement-breakpoint
ALTER TABLE "tallyLedgers" ADD COLUMN "name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyLedgers" ADD COLUMN "varchar" varchar(255);--> statement-breakpoint
ALTER TABLE "tallyLedgers" ADD COLUMN "pincode" varchar(512);--> statement-breakpoint
ALTER TABLE "tallyLedgers" ADD COLUMN "state" varchar(255);--> statement-breakpoint
ALTER TABLE "tallyLedgers" ADD COLUMN "country" varchar(255);--> statement-breakpoint
ALTER TABLE "tallyLedgers" ADD COLUMN "GSTNumber" varchar(512);--> statement-breakpoint
ALTER TABLE "tallyLedgers" ADD COLUMN "region" varchar(512);--> statement-breakpoint
ALTER TABLE "tallyLedgers" ADD COLUMN "salesPerson" varchar(512);--> statement-breakpoint
ALTER TABLE "tallyLedgers" ADD COLUMN "channel" varchar(512);--> statement-breakpoint
ALTER TABLE "tallyLedgers" ADD COLUMN "segment" varchar(512);--> statement-breakpoint
ALTER TABLE "tallyLedgers" ADD COLUMN "creationDate" date;--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ADD COLUMN "name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ADD COLUMN "varchar" varchar(255);--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ADD COLUMN "pincode" varchar(512);--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ADD COLUMN "state" varchar(255);--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ADD COLUMN "country" varchar(255);--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ADD COLUMN "GSTNumber" varchar(512);--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ADD COLUMN "region" varchar(512);--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ADD COLUMN "salesPerson" varchar(512);--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ADD COLUMN "channel" varchar(512);--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ADD COLUMN "segment" varchar(512);--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" ADD COLUMN "creationDate" date;--> statement-breakpoint
ALTER TABLE "tallyStockCategories" ADD COLUMN "name" varchar(200) NOT NULL;--> statement-breakpoint
ALTER TABLE "tallyStockCategories" ADD COLUMN "aliasName" varchar(200);--> statement-breakpoint
ALTER TABLE "tempTallyStockCategories" ADD COLUMN "name" varchar(200) NOT NULL;--> statement-breakpoint
ALTER TABLE "tempTallyStockCategories" ADD COLUMN "aliasName" varchar(200);--> statement-breakpoint
ALTER TABLE "tallyStockGroups" ADD COLUMN "aliasName" varchar(200);--> statement-breakpoint
ALTER TABLE "tempTallyStockGroups" ADD COLUMN "aliasName" varchar(200);--> statement-breakpoint
ALTER TABLE "tallyStockItems" ADD COLUMN "groupMasterId" integer;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ADD COLUMN "categoryMasterId" integer;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ADD COLUMN "baseUnitMasterId" integer;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ADD COLUMN "attributeStr01" text;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ADD COLUMN "attributeStr02" text;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ADD COLUMN "attributeStr03" text;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ADD COLUMN "attributeStr04" text;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ADD COLUMN "attributeStr05" text;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ADD COLUMN "attributeStr06" text;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ADD COLUMN "attributeStr07" text;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ADD COLUMN "attributeStr08" text;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ADD COLUMN "attributeStr09" text;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ADD COLUMN "attributeStr10" text;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ADD COLUMN "attributeNum01" integer;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ADD COLUMN "attributeNum02" integer;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ADD COLUMN "attributeNum03" integer;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ADD COLUMN "attributeNum04" integer;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ADD COLUMN "attributeNum05" integer;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ADD COLUMN "attributeNum06" integer;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ADD COLUMN "attributeNum07" integer;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ADD COLUMN "attributeNum08" integer;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ADD COLUMN "attributeNum09" integer;--> statement-breakpoint
ALTER TABLE "tallyStockItems" ADD COLUMN "attributeNum10" integer;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD COLUMN "groupMasterId" integer;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD COLUMN "categoryMasterId" integer;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD COLUMN "baseUnitMasterId" integer;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD COLUMN "attributeStr01" text;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD COLUMN "attributeStr02" text;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD COLUMN "attributeStr03" text;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD COLUMN "attributeStr04" text;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD COLUMN "attributeStr05" text;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD COLUMN "attributeStr06" text;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD COLUMN "attributeStr07" text;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD COLUMN "attributeStr08" text;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD COLUMN "attributeStr09" text;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD COLUMN "attributeStr10" text;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD COLUMN "attributeNum01" integer;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD COLUMN "attributeNum02" integer;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD COLUMN "attributeNum03" integer;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD COLUMN "attributeNum04" integer;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD COLUMN "attributeNum05" integer;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD COLUMN "attributeNum06" integer;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD COLUMN "attributeNum07" integer;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD COLUMN "attributeNum08" integer;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD COLUMN "attributeNum09" integer;--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" ADD COLUMN "attributeNum10" integer;--> statement-breakpoint
ALTER TABLE "column" ADD COLUMN "alias" varchar(255);--> statement-breakpoint
ALTER TABLE "tallyCompanies" DROP COLUMN IF EXISTS "sortOrder";--> statement-breakpoint
ALTER TABLE "tallyCompanies" DROP COLUMN IF EXISTS "lastSyncDate";--> statement-breakpoint
ALTER TABLE "tallyCompanies" DROP COLUMN IF EXISTS "companyName";--> statement-breakpoint
ALTER TABLE "tallyCompanies" DROP COLUMN IF EXISTS "ledgerAlterID";--> statement-breakpoint
ALTER TABLE "tallyCompanies" DROP COLUMN IF EXISTS "stockItemAlterID";--> statement-breakpoint
ALTER TABLE "tallyCompanies" DROP COLUMN IF EXISTS "voucherMasterID";--> statement-breakpoint
ALTER TABLE "tempTallyCompanies" DROP COLUMN IF EXISTS "sortOrder";--> statement-breakpoint
ALTER TABLE "tempTallyCompanies" DROP COLUMN IF EXISTS "lastSyncDate";--> statement-breakpoint
ALTER TABLE "tempTallyCompanies" DROP COLUMN IF EXISTS "companyName";--> statement-breakpoint
ALTER TABLE "tempTallyCompanies" DROP COLUMN IF EXISTS "ledgerAlterID";--> statement-breakpoint
ALTER TABLE "tempTallyCompanies" DROP COLUMN IF EXISTS "stockItemAlterID";--> statement-breakpoint
ALTER TABLE "tempTallyCompanies" DROP COLUMN IF EXISTS "voucherMasterID";--> statement-breakpoint
ALTER TABLE "tallyGroups" DROP COLUMN IF EXISTS "sortOrder";--> statement-breakpoint
ALTER TABLE "tallyGroups" DROP COLUMN IF EXISTS "lastSyncDate";--> statement-breakpoint
ALTER TABLE "tallyGroups" DROP COLUMN IF EXISTS "groupName";--> statement-breakpoint
ALTER TABLE "tallyGroups" DROP COLUMN IF EXISTS "parentId";--> statement-breakpoint
ALTER TABLE "tempTallyGroups" DROP COLUMN IF EXISTS "sortOrder";--> statement-breakpoint
ALTER TABLE "tempTallyGroups" DROP COLUMN IF EXISTS "lastSyncDate";--> statement-breakpoint
ALTER TABLE "tempTallyGroups" DROP COLUMN IF EXISTS "groupName";--> statement-breakpoint
ALTER TABLE "tempTallyGroups" DROP COLUMN IF EXISTS "parentId";--> statement-breakpoint
ALTER TABLE "tallyLedgers" DROP COLUMN IF EXISTS "sortOrder";--> statement-breakpoint
ALTER TABLE "tallyLedgers" DROP COLUMN IF EXISTS "lastSyncDate";--> statement-breakpoint
ALTER TABLE "tallyLedgers" DROP COLUMN IF EXISTS "ledgerName";--> statement-breakpoint
ALTER TABLE "tallyLedgers" DROP COLUMN IF EXISTS "primaryGroup";--> statement-breakpoint
ALTER TABLE "tallyLedgers" DROP COLUMN IF EXISTS "countryName";--> statement-breakpoint
ALTER TABLE "tallyLedgers" DROP COLUMN IF EXISTS "stateName";--> statement-breakpoint
ALTER TABLE "tallyLedgers" DROP COLUMN IF EXISTS "PINCode";--> statement-breakpoint
ALTER TABLE "tallyLedgers" DROP COLUMN IF EXISTS "GSTIN";--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" DROP COLUMN IF EXISTS "sortOrder";--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" DROP COLUMN IF EXISTS "lastSyncDate";--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" DROP COLUMN IF EXISTS "ledgerName";--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" DROP COLUMN IF EXISTS "primaryGroup";--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" DROP COLUMN IF EXISTS "countryName";--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" DROP COLUMN IF EXISTS "stateName";--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" DROP COLUMN IF EXISTS "PINCode";--> statement-breakpoint
ALTER TABLE "tempTallyLedgers" DROP COLUMN IF EXISTS "GSTIN";--> statement-breakpoint
ALTER TABLE "tallyStockCategories" DROP COLUMN IF EXISTS "sortOrder";--> statement-breakpoint
ALTER TABLE "tallyStockCategories" DROP COLUMN IF EXISTS "lastSyncDate";--> statement-breakpoint
ALTER TABLE "tallyStockCategories" DROP COLUMN IF EXISTS "stockCategoryName";--> statement-breakpoint
ALTER TABLE "tempTallyStockCategories" DROP COLUMN IF EXISTS "sortOrder";--> statement-breakpoint
ALTER TABLE "tempTallyStockCategories" DROP COLUMN IF EXISTS "lastSyncDate";--> statement-breakpoint
ALTER TABLE "tempTallyStockCategories" DROP COLUMN IF EXISTS "stockCategoryName";--> statement-breakpoint
ALTER TABLE "tallyStockGroups" DROP COLUMN IF EXISTS "sortOrder";--> statement-breakpoint
ALTER TABLE "tallyStockGroups" DROP COLUMN IF EXISTS "lastSyncDate";--> statement-breakpoint
ALTER TABLE "tempTallyStockGroups" DROP COLUMN IF EXISTS "sortOrder";--> statement-breakpoint
ALTER TABLE "tempTallyStockGroups" DROP COLUMN IF EXISTS "lastSyncDate";--> statement-breakpoint
ALTER TABLE "tallyStockItems" DROP COLUMN IF EXISTS "sortOrder";--> statement-breakpoint
ALTER TABLE "tallyStockItems" DROP COLUMN IF EXISTS "lastSyncDate";--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" DROP COLUMN IF EXISTS "sortOrder";--> statement-breakpoint
ALTER TABLE "tempTallyStockItems" DROP COLUMN IF EXISTS "lastSyncDate";