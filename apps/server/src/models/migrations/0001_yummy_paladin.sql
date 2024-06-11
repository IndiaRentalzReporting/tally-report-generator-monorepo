CREATE TABLE IF NOT EXISTS "action" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" "actionName" NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permission_action" (
	"permission_id" uuid NOT NULL,
	"action_id" uuid NOT NULL,
	CONSTRAINT "permission_action_permission_id_action_id_pk" PRIMARY KEY("permission_id","action_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "permission_role";--> statement-breakpoint
DROP TABLE "user_role";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role_id" uuid;--> statement-breakpoint
ALTER TABLE "permissions" ADD COLUMN "role_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "permissions" ADD COLUMN "module_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "permission_action" ADD CONSTRAINT "permission_action_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "permission_action" ADD CONSTRAINT "permission_action_action_id_action_id_fk" FOREIGN KEY ("action_id") REFERENCES "public"."action"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "permissions" ADD CONSTRAINT "permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "permissions" ADD CONSTRAINT "permissions_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "permissions" DROP COLUMN IF EXISTS "can_create";--> statement-breakpoint
ALTER TABLE "permissions" DROP COLUMN IF EXISTS "can_read";--> statement-breakpoint
ALTER TABLE "permissions" DROP COLUMN IF EXISTS "can_update";--> statement-breakpoint
ALTER TABLE "permissions" DROP COLUMN IF EXISTS "can_delete";--> statement-breakpoint
ALTER TABLE "permissions" DROP COLUMN IF EXISTS "can_import";--> statement-breakpoint
ALTER TABLE "permissions" DROP COLUMN IF EXISTS "can_export";