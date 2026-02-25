-- 1) add a tsvector column
ALTER TABLE "Product"
ADD COLUMN IF NOT EXISTS "searchVector" tsvector;

-- 2) backfill existing rows
UPDATE "Product"
SET "searchVector" =
  to_tsvector('english', coalesce("name",'') || ' ' || coalesce("description",''));

-- 3) auto-update searchVector on insert/update (trigger)
CREATE OR REPLACE FUNCTION product_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW."searchVector" :=
    to_tsvector('english', coalesce(NEW."name",'') || ' ' || coalesce(NEW."description",''));
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS product_search_vector_trigger ON "Product";

CREATE TRIGGER product_search_vector_trigger
BEFORE INSERT OR UPDATE OF "name", "description"
ON "Product"
FOR EACH ROW EXECUTE FUNCTION product_search_vector_update();

-- 4) index for fast search
CREATE INDEX IF NOT EXISTS "Product_searchVector_gin"
ON "Product"
USING GIN ("searchVector");