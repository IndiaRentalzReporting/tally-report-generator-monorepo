DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('deleted', 'approved', 'active', 'inactive');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"db_name" varchar(128),
	"db_username" varchar(128),
	"db_password" varchar(128),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now(),
	"deletedAt" timestamp,
	"approvedAt" timestamp,
	"lastSyncedAt" timestamp DEFAULT now(),
	"status" "status" DEFAULT 'active' NOT NULL,
	"isReadonly" boolean DEFAULT false NOT NULL,
	"isPrivate" boolean DEFAULT false NOT NULL,
	CONSTRAINT "tenants_name_unique" UNIQUE("name"),
	CONSTRAINT "tenants_db_name_unique" UNIQUE("db_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(128) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_tenant" (
	"user_id" uuid NOT NULL,
	"tenant_id" uuid NOT NULL,
	CONSTRAINT "user_tenant_tenant_id_user_id_pk" PRIMARY KEY("tenant_id","user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_tenant" ADD CONSTRAINT "user_tenant_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_tenant" ADD CONSTRAINT "user_tenant_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
