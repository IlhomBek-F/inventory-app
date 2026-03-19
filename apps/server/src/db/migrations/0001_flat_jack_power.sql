CREATE TYPE "public"."movement_type" AS ENUM('in', 'out', 'adjustment');--> statement-breakpoint
CREATE TABLE "shoe" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"brand" text NOT NULL,
	"category" text NOT NULL,
	"size" text NOT NULL,
	"color" text DEFAULT '',
	"condition" text DEFAULT 'New',
	"sku" text DEFAULT '',
	"barcode" text DEFAULT '',
	"description" text DEFAULT '',
	"image_url" text DEFAULT '',
	"cost_price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"sell_price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"min_stock_alert" integer DEFAULT 5 NOT NULL,
	"supplier" text DEFAULT '',
	"location" text DEFAULT '',
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_movement" (
	"id" text PRIMARY KEY NOT NULL,
	"shoe_id" text NOT NULL,
	"type" "movement_type" NOT NULL,
	"quantity" integer NOT NULL,
	"reason" text DEFAULT '',
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "shoe" ADD CONSTRAINT "shoe_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_shoe_id_shoe_id_fk" FOREIGN KEY ("shoe_id") REFERENCES "public"."shoe"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "shoe_userId_idx" ON "shoe" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "shoe_sku_idx" ON "shoe" USING btree ("sku");--> statement-breakpoint
CREATE INDEX "shoe_brand_idx" ON "shoe" USING btree ("brand");--> statement-breakpoint
CREATE INDEX "shoe_category_idx" ON "shoe" USING btree ("category");--> statement-breakpoint
CREATE INDEX "stock_movement_shoeId_idx" ON "stock_movement" USING btree ("shoe_id");--> statement-breakpoint
CREATE INDEX "stock_movement_userId_idx" ON "stock_movement" USING btree ("user_id");