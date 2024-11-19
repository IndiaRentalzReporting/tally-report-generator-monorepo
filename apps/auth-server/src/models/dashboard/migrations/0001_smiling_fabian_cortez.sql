DO $$ BEGIN
 CREATE TYPE "public"."exportFrequency" AS ENUM('daily', 'weekly', 'monthly', 'custom');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reportAccess" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reportId" uuid NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reportExportSchedule" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reportId" uuid NOT NULL,
	"frequency" "exportFrequency" NOT NULL,
	"time_of_day" time DEFAULT '00:00:00' NOT NULL,
	"daysOfWeek" json,
	"daysOfMonth" json,
	"customInterval" integer,
	"next_run" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reportScheduleUsers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scheduleId" uuid NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reportAccess" ADD CONSTRAINT "reportAccess_reportId_reports_id_fk" FOREIGN KEY ("reportId") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reportAccess" ADD CONSTRAINT "reportAccess_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reportExportSchedule" ADD CONSTRAINT "reportExportSchedule_reportId_reports_id_fk" FOREIGN KEY ("reportId") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reportScheduleUsers" ADD CONSTRAINT "reportScheduleUsers_scheduleId_reportExportSchedule_id_fk" FOREIGN KEY ("scheduleId") REFERENCES "public"."reportExportSchedule"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reportScheduleUsers" ADD CONSTRAINT "reportScheduleUsers_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
