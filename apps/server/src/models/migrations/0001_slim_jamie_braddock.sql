CREATE TABLE IF NOT EXISTS "company" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"companyName" varchar(200),
	"companyMailName" varchar(200),
	"guid" varchar(200),
	"companyNumber" varchar(200),
	"ledgerAlterID" integer,
	"stockItemAlterID" integer,
	"voucherMasterID" integer,
	"lastSyncDate" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"companyName" varchar(200),
	"groupName" varchar(200),
	"aliasName" varchar(200),
	"parentId" integer,
	"primaryGroup" varchar(200),
	"natureofGroup" varchar(200),
	"alterID" integer,
	"masterID" integer,
	"sortOrder" integer,
	"lastSyncDate" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ledgers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"companyID" uuid,
	"ledgerName" varchar(200),
	"aliasName" varchar(200),
	"parent" varchar(200),
	"primaryGroup" varchar(200),
	"mailingName" varchar(200),
	"addressLine1" varchar(200),
	"addressLine2" varchar(200),
	"addressLine3" varchar(200),
	"addressLine4" varchar(200),
	"countryName" varchar(100),
	"stateName" varchar(100),
	"PINCode" varchar(10),
	"GSTIN" varchar(20),
	"PANNo" varchar(20),
	"contactPerson" varchar(100),
	"mobile" varchar(20),
	"phone" varchar(20),
	"fax" varchar(20),
	"email" varchar(100),
	"emailCC" varchar(100),
	"website" varchar(100),
	"openingBalance" double precision,
	"masterID" integer,
	"alterID" integer,
	"sortOrder" integer,
	"lastSyncDate" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"companyId" uuid,
	"masterId" integer,
	"alterId" integer,
	"stockCategoryName" varchar(200) NOT NULL,
	"parent" varchar(500),
	"sortOrder" integer,
	"lastSyncDate" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock_group" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"companyId" uuid,
	"masterId" integer,
	"stockGroupName" varchar(200) NOT NULL,
	"parent" varchar(500),
	"alterId" integer,
	"sortOrder" integer,
	"lastSyncDate" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"companyId" uuid,
	"stockGroupName" varchar(200) NOT NULL,
	"parent" varchar(500),
	"openingBalance" double precision,
	"openingRate" double precision,
	"openingValue" double precision,
	"baseUnits" varchar(200),
	"masterId" integer,
	"alterId" integer,
	"sortOrder" integer,
	"lastSyncDate" timestamp
);
