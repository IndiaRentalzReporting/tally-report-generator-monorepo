DO $$ BEGIN
 CREATE TYPE "public"."column_type" AS ENUM('id', 'string', 'number', 'date', 'foreignKey');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "column" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
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
	"tables" json,
	"columns" json,
	"filters" json,
	"groupBy" json,
	"conditions" json,
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
