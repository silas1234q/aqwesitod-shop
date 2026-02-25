-- Create the trigger function
CREATE OR REPLACE FUNCTION product_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW."searchVector" :=
    to_tsvector('english', coalesce(NEW.name,'') || ' ' || coalesce(NEW.description,''));
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER product_search_vector_trigger
BEFORE INSERT OR UPDATE OF name, description
ON "Product"
FOR EACH ROW EXECUTE FUNCTION product_search_vector_update();

-- Backfill existing data
UPDATE "Product"
SET "searchVector" = to_tsvector('english', coalesce(name,'') || ' ' || coalesce(description,''));

-- Add GIN index
CREATE INDEX IF NOT EXISTS "Product_searchVector_gin"
ON "Product" USING GIN ("searchVector");