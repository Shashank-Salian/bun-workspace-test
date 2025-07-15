ALTER TABLE "users" DROP CONSTRAINT "users_unique_email_key";--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_category_fk";
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "fk_products_category" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "uq_users_email" UNIQUE("email");