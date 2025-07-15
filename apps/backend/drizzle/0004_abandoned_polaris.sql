ALTER TABLE "products" DROP CONSTRAINT "products_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "category";
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "fk_products_category" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;