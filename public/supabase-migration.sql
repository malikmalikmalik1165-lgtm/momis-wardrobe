-- ============================================================
-- MOMIS WARDROBE — SUPABASE MIGRATION
-- Complete schema-only migration for NEW EMPTY Supabase database
-- Generated from verified local schema + Drizzle definitions
-- 11 tables, 3 foreign keys, 8 unique constraints, 11 PKs
-- 
-- SAFE TO RUN: Creates tables only, no data, no destructive SQL
-- ============================================================

-- ==========================================
-- 1. CATEGORIES (no dependencies)
-- ==========================================
CREATE TABLE IF NOT EXISTS categories (
  id            SERIAL        PRIMARY KEY,
  name          TEXT          NOT NULL,
  slug          TEXT          NOT NULL UNIQUE,
  description   TEXT,
  image         TEXT,
  created_at    TIMESTAMP     NOT NULL DEFAULT now()
);

-- ==========================================
-- 2. PRODUCTS (depends on: categories)
-- ==========================================
CREATE TABLE IF NOT EXISTS products (
  id                SERIAL          PRIMARY KEY,
  sku               TEXT,
  name              TEXT            NOT NULL,
  slug              TEXT            NOT NULL UNIQUE,
  description       TEXT            NOT NULL,
  price             NUMERIC(10,2)   NOT NULL,
  compare_at_price  NUMERIC(10,2),
  category_id       INTEGER         REFERENCES categories(id),
  images            JSON            NOT NULL DEFAULT '[]'::json,
  sizes             JSON            NOT NULL DEFAULT '[]'::json,
  colors            JSON            NOT NULL DEFAULT '[]'::json,
  in_stock          BOOLEAN         NOT NULL DEFAULT true,
  featured          BOOLEAN         NOT NULL DEFAULT false,
  badge             TEXT,
  created_at        TIMESTAMP       NOT NULL DEFAULT now()
);

-- ==========================================
-- 3. REVIEWS (depends on: products)
-- ==========================================
CREATE TABLE IF NOT EXISTS reviews (
  id          SERIAL      PRIMARY KEY,
  product_id  INTEGER     NOT NULL REFERENCES products(id),
  author      TEXT        NOT NULL,
  rating      INTEGER     NOT NULL,
  title       TEXT,
  body        TEXT,
  verified    BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMP   NOT NULL DEFAULT now()
);

-- ==========================================
-- 4. CUSTOMERS (no dependencies)
-- ==========================================
CREATE TABLE IF NOT EXISTS customers (
  id              SERIAL      PRIMARY KEY,
  name            TEXT        NOT NULL,
  phone           TEXT        NOT NULL UNIQUE,
  password        TEXT        NOT NULL,
  city            TEXT,
  postal_code     TEXT,
  address         TEXT,
  phone_verified  BOOLEAN     NOT NULL DEFAULT false,
  wishlist        JSON        NOT NULL DEFAULT '[]'::json,
  created_at      TIMESTAMP   NOT NULL DEFAULT now()
);

-- ==========================================
-- 5. TEAM MEMBERS (no dependencies)
-- ==========================================
CREATE TABLE IF NOT EXISTS team_members (
  id                  SERIAL          PRIMARY KEY,
  name                TEXT            NOT NULL,
  phone               TEXT            NOT NULL UNIQUE,
  password            TEXT            NOT NULL,
  city                TEXT,
  referral_code       TEXT            NOT NULL UNIQUE,
  total_earnings      NUMERIC(10,2)   NOT NULL DEFAULT 0,
  total_sales         INTEGER         NOT NULL DEFAULT 0,
  commission_percent  INTEGER         NOT NULL DEFAULT 10,
  active              BOOLEAN         NOT NULL DEFAULT true,
  created_at          TIMESTAMP       NOT NULL DEFAULT now()
);

-- ==========================================
-- 6. ORDERS (depends on: customers)
-- ==========================================
CREATE TABLE IF NOT EXISTS orders (
  id                  SERIAL          PRIMARY KEY,
  tracking_id         TEXT            NOT NULL UNIQUE,
  customer_id         INTEGER         REFERENCES customers(id),
  customer_name       TEXT            NOT NULL,
  customer_email      TEXT            NOT NULL,
  customer_phone      TEXT,
  shipping_address    TEXT            NOT NULL,
  items               JSON            NOT NULL,
  subtotal            NUMERIC(10,2)   NOT NULL,
  shipping            NUMERIC(10,2)   NOT NULL,
  total               NUMERIC(10,2)   NOT NULL,
  status              TEXT            NOT NULL DEFAULT 'pending',
  courier_name        TEXT,
  courier_tracking_id TEXT,
  admin_notes         TEXT,
  referral_code       TEXT,
  status_history      JSON            NOT NULL DEFAULT '[]'::json,
  created_at          TIMESTAMP       NOT NULL DEFAULT now()
);

-- ==========================================
-- 7. DISCOUNT CODES (no dependencies)
-- ==========================================
CREATE TABLE IF NOT EXISTS discount_codes (
  id                SERIAL      PRIMARY KEY,
  code              TEXT        NOT NULL UNIQUE,
  discount_percent  INTEGER     NOT NULL,
  max_uses          INTEGER,
  used_count        INTEGER     NOT NULL DEFAULT 0,
  active            BOOLEAN     NOT NULL DEFAULT true,
  created_at        TIMESTAMP   NOT NULL DEFAULT now()
);

-- ==========================================
-- 8. JOIN REQUESTS (no dependencies)
-- ==========================================
CREATE TABLE IF NOT EXISTS join_requests (
  id          SERIAL      PRIMARY KEY,
  name        TEXT        NOT NULL,
  phone       TEXT        NOT NULL,
  city        TEXT        NOT NULL,
  message     TEXT,
  status      TEXT        NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMP   NOT NULL DEFAULT now()
);

-- ==========================================
-- 9. NOTIFICATIONS (no dependencies)
-- ==========================================
CREATE TABLE IF NOT EXISTS notifications (
  id          SERIAL      PRIMARY KEY,
  title       TEXT        NOT NULL,
  body        TEXT        NOT NULL,
  url         TEXT,
  sent_count  INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMP   NOT NULL DEFAULT now()
);

-- ==========================================
-- 10. OTP CODES (no dependencies)
-- ==========================================
CREATE TABLE IF NOT EXISTS otp_codes (
  id          SERIAL      PRIMARY KEY,
  phone       TEXT        NOT NULL,
  code        TEXT        NOT NULL,
  verified    BOOLEAN     NOT NULL DEFAULT false,
  expires_at  TIMESTAMP   NOT NULL,
  created_at  TIMESTAMP   NOT NULL DEFAULT now()
);

-- ==========================================
-- 11. PUSH SUBSCRIPTIONS (no dependencies)
-- ==========================================
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id          SERIAL      PRIMARY KEY,
  endpoint    TEXT        NOT NULL UNIQUE,
  keys        JSON        NOT NULL,
  created_at  TIMESTAMP   NOT NULL DEFAULT now()
);

-- ==========================================
-- PERFORMANCE INDEXES
-- (beyond PKs and UNIQUE constraints which already create indexes)
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured    ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at  ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id   ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id   ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status        ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at    ON orders(created_at DESC);

-- ============================================================
-- END OF MIGRATION
-- ============================================================
