-- ============================================================
-- DoorTracker Phase 1: Initial Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE public.users (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT UNIQUE NOT NULL,
  name       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON public.users(email);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- PROPERTIES TABLE
-- ============================================================
CREATE TABLE public.properties (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  address      TEXT NOT NULL,
  nickname     TEXT,
  monthly_rent NUMERIC(10, 2) NOT NULL CHECK (monthly_rent >= 0),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_properties_user_id ON public.properties(user_id);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own properties"
  ON public.properties FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own properties"
  ON public.properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own properties"
  ON public.properties FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own properties"
  ON public.properties FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- EXPENSES TABLE
-- ============================================================
CREATE TABLE public.expenses (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  property_id          UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  vendor               TEXT NOT NULL,
  amount               NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  expense_date         DATE NOT NULL,
  category             TEXT NOT NULL CHECK (category IN (
                         'Advertising',
                         'Auto and travel',
                         'Cleaning and maintenance',
                         'Commissions',
                         'Insurance',
                         'Legal and professional fees',
                         'Management fees',
                         'Mortgage interest',
                         'Other interest',
                         'Repairs',
                         'Supplies',
                         'Taxes',
                         'Utilities',
                         'Depreciation',
                         'Other'
                       )),
  description          TEXT,
  source_email_subject TEXT,
  confirmed            BOOLEAN NOT NULL DEFAULT false,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_expenses_user_date ON public.expenses(user_id, expense_date DESC);
CREATE INDEX idx_expenses_property_id ON public.expenses(property_id);
CREATE INDEX idx_expenses_unconfirmed ON public.expenses(user_id, confirmed)
  WHERE confirmed = false;

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own expenses"
  ON public.expenses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
  ON public.expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON public.expenses FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON public.expenses FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- AUTO-CREATE USER PROFILE ON SIGN-UP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
