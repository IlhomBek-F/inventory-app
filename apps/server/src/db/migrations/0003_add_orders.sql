CREATE TYPE "order_type" AS ENUM ('sale', 'purchase');

CREATE TABLE "order" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "type" "order_type" NOT NULL,
  "customer_or_supplier" text DEFAULT '',
  "notes" text DEFAULT '',
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX "order_userId_idx" ON "order" ("user_id");

ALTER TABLE "stock_movement" ADD COLUMN "order_id" text REFERENCES "order"("id") ON DELETE SET NULL;
