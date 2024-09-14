DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('deleted', 'approved', 'active', 'inactive');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"isReadonly" boolean DEFAULT false NOT NULL,
	"isPrivate" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now(),
	"deletedAt" timestamp,
	"approvedAt" timestamp,
	"lastSyncedAt" timestamp DEFAULT now(),
	"db_name" varchar(128),
	"db_username" varchar(128),
	"db_password" varchar(128),
	CONSTRAINT "tenants_name_unique" UNIQUE("name"),
	CONSTRAINT "tenants_db_name_unique" UNIQUE("db_name")
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
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(128) NOT NULL,
	"tenant_id" uuid,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
