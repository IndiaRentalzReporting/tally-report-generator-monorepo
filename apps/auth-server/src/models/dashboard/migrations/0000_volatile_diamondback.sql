DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('deleted', 'approved', 'active', 'inactive');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."column_type" AS ENUM('id', 'string', 'number', 'date', 'foreignKey');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"isReadonly" boolean DEFAULT false NOT NULL,
	"isPrivate" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now(),
	"deletedAt" timestamp,
	"approvedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "apiKeys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"isReadonly" boolean DEFAULT false NOT NULL,
	"isPrivate" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now(),
	"deletedAt" timestamp,
	"approvedAt" timestamp,
	"key" varchar(64) NOT NULL,
	CONSTRAINT "apiKeys_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"isReadonly" boolean DEFAULT false NOT NULL,
	"isPrivate" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now(),
	"deletedAt" timestamp,
	"approvedAt" timestamp,
	"icon" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permission_action" (
	"status" "status" DEFAULT 'active' NOT NULL,
	"isReadonly" boolean DEFAULT false NOT NULL,
	"isPrivate" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now(),
	"deletedAt" timestamp,
	"approvedAt" timestamp,
	"permission_id" uuid NOT NULL,
	"action_id" uuid NOT NULL,
	CONSTRAINT "permission_action_permission_id_action_id_pk" PRIMARY KEY("permission_id","action_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"isReadonly" boolean DEFAULT false NOT NULL,
	"isPrivate" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now(),
	"deletedAt" timestamp,
	"approvedAt" timestamp,
	"role_id" uuid NOT NULL,
	"module_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"isReadonly" boolean DEFAULT false NOT NULL,
	"isPrivate" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now(),
	"deletedAt" timestamp,
	"approvedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"isReadonly" boolean DEFAULT false NOT NULL,
	"isPrivate" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now(),
	"deletedAt" timestamp,
	"approvedAt" timestamp,
	"role_id" uuid,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(128) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_tallyCompany" (
	"status" "status" DEFAULT 'active' NOT NULL,
	"isReadonly" boolean DEFAULT false NOT NULL,
	"isPrivate" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now(),
	"deletedAt" timestamp,
	"approvedAt" timestamp,
	"user_id" uuid NOT NULL,
	"tallyCompany_id" uuid NOT NULL,
	CONSTRAINT "user_tallyCompany_user_id_tallyCompany_id_pk" PRIMARY KEY("user_id","tallyCompany_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tallyCompanies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"masterId" integer NOT NULL,
	"alterId" integer NOT NULL,
	"name" varchar(200) NOT NULL,
	"companyMailName" varchar(200),
	"companyNumber" varchar(200),
	"GSTNumber" varchar(512),
	CONSTRAINT "tallyCompanies_masterId_unique" UNIQUE("masterId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tempTallyCompanies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"masterId" integer NOT NULL,
	"alterId" integer NOT NULL,
	"name" varchar(200) NOT NULL,
	"companyMailName" varchar(200),
	"companyNumber" varchar(200),
	"GSTNumber" varchar(512),
	CONSTRAINT "tempTallyCompanies_masterId_unique" UNIQUE("masterId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tallyGroups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterId" integer NOT NULL,
	"alterId" integer NOT NULL,
	"name" varchar(200),
	"aliasName" varchar(200),
	"parent" text,
	"primaryGroup" varchar(200),
	"natureofGroup" varchar(200),
	CONSTRAINT "tallyGroups_masterId_unique" UNIQUE("masterId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tempTallyGroups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterId" integer NOT NULL,
	"alterId" integer NOT NULL,
	"name" varchar(200),
	"aliasName" varchar(200),
	"parent" text,
	"primaryGroup" varchar(200),
	"natureofGroup" varchar(200),
	CONSTRAINT "tempTallyGroups_masterId_unique" UNIQUE("masterId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tallyInventoryVouchers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterId" integer NOT NULL,
	"alterId" integer NOT NULL,
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
	CONSTRAINT "tallyInventoryVouchers_masterId_unique" UNIQUE("masterId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tempTallyInventoryVouchers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterId" integer NOT NULL,
	"alterId" integer NOT NULL,
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
	CONSTRAINT "tempTallyInventoryVouchers_masterId_unique" UNIQUE("masterId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tallyLedgers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterId" integer NOT NULL,
	"alterId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"parent" varchar(255) NOT NULL,
	"aliasName" varchar(255),
	"varchar" varchar(255),
	"addressLine1" varchar(255),
	"addressLine2" varchar(255),
	"addressLine3" varchar(255),
	"addressLine4" varchar(255),
	"pincode" varchar(512),
	"state" varchar(255),
	"country" varchar(255),
	"GSTNumber" varchar(512),
	"PANNo" varchar(512),
	"mailingName" varchar(255),
	"contactPerson" varchar(512),
	"mobile" varchar(512),
	"phone" varchar(512),
	"fax" varchar(512),
	"email" varchar(512),
	"emailCC" varchar(512),
	"website" varchar(512),
	"openingBalance" integer,
	"region" varchar(512),
	"salesPerson" varchar(512),
	"channel" varchar(512),
	"segment" varchar(512),
	"creationDate" date,
	CONSTRAINT "tallyLedgers_masterId_unique" UNIQUE("masterId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tempTallyLedgers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterId" integer NOT NULL,
	"alterId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"parent" varchar(255) NOT NULL,
	"aliasName" varchar(255),
	"varchar" varchar(255),
	"addressLine1" varchar(255),
	"addressLine2" varchar(255),
	"addressLine3" varchar(255),
	"addressLine4" varchar(255),
	"pincode" varchar(512),
	"state" varchar(255),
	"country" varchar(255),
	"GSTNumber" varchar(512),
	"PANNo" varchar(512),
	"mailingName" varchar(255),
	"contactPerson" varchar(512),
	"mobile" varchar(512),
	"phone" varchar(512),
	"fax" varchar(512),
	"email" varchar(512),
	"emailCC" varchar(512),
	"website" varchar(512),
	"openingBalance" integer,
	"region" varchar(512),
	"salesPerson" varchar(512),
	"channel" varchar(512),
	"segment" varchar(512),
	"creationDate" date,
	CONSTRAINT "tempTallyLedgers_masterId_unique" UNIQUE("masterId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tallyStockCategories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterId" integer NOT NULL,
	"alterId" integer NOT NULL,
	"name" varchar(200) NOT NULL,
	"aliasName" varchar(200),
	"parent" varchar(500),
	CONSTRAINT "tallyStockCategories_masterId_unique" UNIQUE("masterId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tempTallyStockCategories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterId" integer NOT NULL,
	"alterId" integer NOT NULL,
	"name" varchar(200) NOT NULL,
	"aliasName" varchar(200),
	"parent" varchar(500),
	CONSTRAINT "tempTallyStockCategories_masterId_unique" UNIQUE("masterId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tallyStockGroups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterId" integer NOT NULL,
	"alterId" integer NOT NULL,
	"stockGroupName" varchar(200) NOT NULL,
	"aliasName" varchar(200),
	"parent" varchar(500),
	CONSTRAINT "tallyStockGroups_masterId_unique" UNIQUE("masterId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tempTallyStockGroups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterId" integer NOT NULL,
	"alterId" integer NOT NULL,
	"stockGroupName" varchar(200) NOT NULL,
	"aliasName" varchar(200),
	"parent" varchar(500),
	CONSTRAINT "tempTallyStockGroups_masterId_unique" UNIQUE("masterId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tallyStockItems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterId" integer NOT NULL,
	"alterId" integer NOT NULL,
	"name" varchar(500) NOT NULL,
	"parent" varchar(500),
	"aliasName" varchar(200),
	"groupMasterId" integer,
	"category" varchar(500),
	"categoryMasterId" integer,
	"openingBalance" double precision,
	"openingRate" double precision,
	"openingValue" double precision,
	"baseUnits" varchar(200),
	"baseUnitMasterId" integer,
	"attributeStr01" text,
	"attributeStr02" text,
	"attributeStr03" text,
	"attributeStr04" text,
	"attributeStr05" text,
	"attributeStr06" text,
	"attributeStr07" text,
	"attributeStr08" text,
	"attributeStr09" text,
	"attributeStr10" text,
	"attributeNum01" integer,
	"attributeNum02" integer,
	"attributeNum03" integer,
	"attributeNum04" integer,
	"attributeNum05" integer,
	"attributeNum06" integer,
	"attributeNum07" integer,
	"attributeNum08" integer,
	"attributeNum09" integer,
	"attributeNum10" integer,
	CONSTRAINT "tallyStockItems_masterId_unique" UNIQUE("masterId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tempTallyStockItems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterId" integer NOT NULL,
	"alterId" integer NOT NULL,
	"name" varchar(500) NOT NULL,
	"parent" varchar(500),
	"aliasName" varchar(200),
	"groupMasterId" integer,
	"category" varchar(500),
	"categoryMasterId" integer,
	"openingBalance" double precision,
	"openingRate" double precision,
	"openingValue" double precision,
	"baseUnits" varchar(200),
	"baseUnitMasterId" integer,
	"attributeStr01" text,
	"attributeStr02" text,
	"attributeStr03" text,
	"attributeStr04" text,
	"attributeStr05" text,
	"attributeStr06" text,
	"attributeStr07" text,
	"attributeStr08" text,
	"attributeStr09" text,
	"attributeStr10" text,
	"attributeNum01" integer,
	"attributeNum02" integer,
	"attributeNum03" integer,
	"attributeNum04" integer,
	"attributeNum05" integer,
	"attributeNum06" integer,
	"attributeNum07" integer,
	"attributeNum08" integer,
	"attributeNum09" integer,
	"attributeNum10" integer,
	CONSTRAINT "tempTallyStockItems_masterId_unique" UNIQUE("masterId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tallyUnits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterId" integer NOT NULL,
	"alterId" integer NOT NULL,
	"name" varchar(200),
	CONSTRAINT "tallyUnits_masterId_unique" UNIQUE("masterId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tempTallyUnits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterId" integer NOT NULL,
	"alterId" integer NOT NULL,
	"name" varchar(200),
	CONSTRAINT "tempTallyUnits_masterId_unique" UNIQUE("masterId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tallyVouchers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterId" integer NOT NULL,
	"alterId" integer NOT NULL,
	"voucherTypeName" varchar(255),
	"date" date,
	"voucherNumber" varchar(512),
	"narration" text,
	CONSTRAINT "tallyVouchers_masterId_unique" UNIQUE("masterId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tempTallyVouchers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterId" integer NOT NULL,
	"alterId" integer NOT NULL,
	"voucherTypeName" varchar(255),
	"date" date,
	"voucherNumber" varchar(512),
	"narration" text,
	CONSTRAINT "tempTallyVouchers_masterId_unique" UNIQUE("masterId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "column" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"alias" varchar(255),
	"name" varchar(255) NOT NULL,
	"type" "column_type" DEFAULT 'string' NOT NULL,
	"tableId" uuid NOT NULL,
	"referenceTable" text,
	"referenceColumn" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "report" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(500) NOT NULL,
	"description" text DEFAULT '',
	"baseEntity" uuid NOT NULL,
	"tables" json DEFAULT '[]'::json NOT NULL,
	"columns" json DEFAULT '[]'::json NOT NULL,
	"filters" json DEFAULT '[]'::json NOT NULL,
	"groupBy" json DEFAULT '[]'::json NOT NULL,
	"conditions" json DEFAULT '[]'::json NOT NULL,
	"queryConfig" json,
	CONSTRAINT "report_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"displayName" varchar NOT NULL,
	CONSTRAINT "table_name_unique" UNIQUE("name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "permission_action" ADD CONSTRAINT "permission_action_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "permission_action" ADD CONSTRAINT "permission_action_action_id_actions_id_fk" FOREIGN KEY ("action_id") REFERENCES "public"."actions"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "permissions" ADD CONSTRAINT "permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "permissions" ADD CONSTRAINT "permissions_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_tallyCompany" ADD CONSTRAINT "user_tallyCompany_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_tallyCompany" ADD CONSTRAINT "user_tallyCompany_tallyCompany_id_tallyCompanies_id_fk" FOREIGN KEY ("tallyCompany_id") REFERENCES "public"."tallyCompanies"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "column" ADD CONSTRAINT "column_tableId_table_id_fk" FOREIGN KEY ("tableId") REFERENCES "public"."table"("id") ON DELETE restrict ON UPDATE restrict;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "report" ADD CONSTRAINT "report_baseEntity_table_id_fk" FOREIGN KEY ("baseEntity") REFERENCES "public"."table"("id") ON DELETE restrict ON UPDATE restrict;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
