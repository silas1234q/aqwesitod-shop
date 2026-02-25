-- Drop the problematic trigger
DROP TRIGGER IF EXISTS product_search_vector_trigger ON "Product";
DROP FUNCTION IF EXISTS product_search_vector_update();