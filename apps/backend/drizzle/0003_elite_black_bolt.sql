ALTER TABLE "users" DROP CONSTRAINT "users_email_key";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_unique_email_key" UNIQUE("email");