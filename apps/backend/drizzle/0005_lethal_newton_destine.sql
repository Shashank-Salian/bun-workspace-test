ALTER TABLE "products" DROP CONSTRAINT "fk_products_category";
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;