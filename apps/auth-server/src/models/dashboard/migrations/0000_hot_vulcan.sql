DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('deleted', 'approved', 'active', 'inactive');
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
	"icon" text
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
CREATE TABLE IF NOT EXISTS "tally_company" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"masterID" integer NOT NULL,
	"alterID" integer NOT NULL,
	"sortOrder" integer NOT NULL,
	"lastSyncDate" date NOT NULL,
	"companyName" varchar(200) NOT NULL,
	"companyMailName" varchar(200) NOT NULL,
	"companyNumber" varchar(200) NOT NULL,
	"ledgerAlterID" integer NOT NULL,
	"stockItemAlterID" integer NOT NULL,
	"voucherMasterID" integer NOT NULL,
	CONSTRAINT "tally_company_masterID_unique" UNIQUE("masterID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "temp_tally_company" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"masterID" integer NOT NULL,
	"alterID" integer NOT NULL,
	"sortOrder" integer NOT NULL,
	"lastSyncDate" date NOT NULL,
	"companyName" varchar(200) NOT NULL,
	"companyMailName" varchar(200) NOT NULL,
	"companyNumber" varchar(200) NOT NULL,
	"ledgerAlterID" integer NOT NULL,
	"stockItemAlterID" integer NOT NULL,
	"voucherMasterID" integer NOT NULL,
	CONSTRAINT "tally_company_masterID_unique" UNIQUE("masterID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tally_group" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterID" integer NOT NULL,
	"alterID" integer NOT NULL,
	"sortOrder" integer NOT NULL,
	"lastSyncDate" date NOT NULL,
	"groupName" varchar(200),
	"aliasName" varchar(200),
	"parentId" integer,
	"primaryGroup" varchar(200),
	"natureofGroup" varchar(200),
	CONSTRAINT "tally_company_masterID_unique" UNIQUE("masterID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "temp_tally_group" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterID" integer NOT NULL,
	"alterID" integer NOT NULL,
	"sortOrder" integer NOT NULL,
	"lastSyncDate" date NOT NULL,
	"groupName" varchar(200),
	"aliasName" varchar(200),
	"parentId" integer,
	"primaryGroup" varchar(200),
	"natureofGroup" varchar(200),
	CONSTRAINT "tally_company_masterID_unique" UNIQUE("masterID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tally_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterID" integer NOT NULL,
	"alterID" integer NOT NULL,
	"sortOrder" integer NOT NULL,
	"lastSyncDate" date NOT NULL,
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
	CONSTRAINT "tally_company_masterID_unique" UNIQUE("masterID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "temp_tally_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterID" integer NOT NULL,
	"alterID" integer NOT NULL,
	"sortOrder" integer NOT NULL,
	"lastSyncDate" date NOT NULL,
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
	CONSTRAINT "tally_company_masterID_unique" UNIQUE("masterID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tally_stock_category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterID" integer NOT NULL,
	"alterID" integer NOT NULL,
	"sortOrder" integer NOT NULL,
	"lastSyncDate" date NOT NULL,
	"stockCategoryName" varchar(200) NOT NULL,
	"parent" varchar(500),
	CONSTRAINT "tally_company_masterID_unique" UNIQUE("masterID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "temp_tally_stock_category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterID" integer NOT NULL,
	"alterID" integer NOT NULL,
	"sortOrder" integer NOT NULL,
	"lastSyncDate" date NOT NULL,
	"stockCategoryName" varchar(200) NOT NULL,
	"parent" varchar(500),
	CONSTRAINT "tally_company_masterID_unique" UNIQUE("masterID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tally_stock_group" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterID" integer NOT NULL,
	"alterID" integer NOT NULL,
	"sortOrder" integer NOT NULL,
	"lastSyncDate" date NOT NULL,
	"stockGroupName" varchar(200) NOT NULL,
	"parent" varchar(500),
	CONSTRAINT "tally_company_masterID_unique" UNIQUE("masterID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "temp_tally_stock_group" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterID" integer NOT NULL,
	"alterID" integer NOT NULL,
	"sortOrder" integer NOT NULL,
	"lastSyncDate" date NOT NULL,
	"stockGroupName" varchar(200) NOT NULL,
	"parent" varchar(500),
	CONSTRAINT "tally_company_masterID_unique" UNIQUE("masterID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tally_stock_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterID" integer NOT NULL,
	"alterID" integer NOT NULL,
	"sortOrder" integer NOT NULL,
	"lastSyncDate" date NOT NULL,
	"stockItemName" varchar(200) NOT NULL,
	"aliasName" varchar(200) NOT NULL,
	"parent" varchar(500) NOT NULL,
	"category" varchar(500) NOT NULL,
	"openingBalance" double precision NOT NULL,
	"openingRate" double precision NOT NULL,
	"openingValue" double precision NOT NULL,
	"baseUnits" varchar(200) NOT NULL,
	CONSTRAINT "tally_company_masterID_unique" UNIQUE("masterID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "temp_tally_stock_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guid" varchar(200) NOT NULL,
	"companyId" varchar,
	"masterID" integer NOT NULL,
	"alterID" integer NOT NULL,
	"sortOrder" integer NOT NULL,
	"lastSyncDate" date NOT NULL,
	"stockItemName" varchar(200) NOT NULL,
	"aliasName" varchar(200) NOT NULL,
	"parent" varchar(500) NOT NULL,
	"category" varchar(500) NOT NULL,
	"openingBalance" double precision NOT NULL,
	"openingRate" double precision NOT NULL,
	"openingValue" double precision NOT NULL,
	"baseUnits" varchar(200) NOT NULL,
	CONSTRAINT "tally_company_masterID_unique" UNIQUE("masterID")
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
 ALTER TABLE "user_tallyCompany" ADD CONSTRAINT "user_tallyCompany_tallyCompany_id_tally_company_id_fk" FOREIGN KEY ("tallyCompany_id") REFERENCES "public"."tally_company"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
