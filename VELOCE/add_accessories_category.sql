ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;
ALTER TABLE products ADD CONSTRAINT products_category_check CHECK (category IN ('football', 'f1', 'worldcup', 'basketball', 'cricket', 'accessories'));
