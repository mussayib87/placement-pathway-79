-- 1. Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  display_name text NOT NULL DEFAULT '',
  college text,
  graduation_year integer,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Ownership columns
ALTER TABLE public.companies ADD COLUMN user_id uuid;
ALTER TABLE public.interview_experiences ADD COLUMN user_id uuid;
ALTER TABLE public.resources ADD COLUMN user_id uuid;

-- 3. Replace permissive policies
DROP POLICY IF EXISTS "Public can manage companies" ON public.companies;
DROP POLICY IF EXISTS "Public can manage experiences" ON public.interview_experiences;
DROP POLICY IF EXISTS "Public can manage resources" ON public.resources;

GRANT SELECT ON public.companies TO anon;
GRANT SELECT ON public.interview_experiences TO anon;
GRANT SELECT ON public.resources TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.companies TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.interview_experiences TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resources TO authenticated;
GRANT ALL ON public.companies TO service_role;
GRANT ALL ON public.interview_experiences TO service_role;
GRANT ALL ON public.resources TO service_role;

CREATE POLICY "Companies are viewable by everyone" ON public.companies FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Signed-in users can add companies" ON public.companies FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can update companies" ON public.companies FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can delete companies" ON public.companies FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Experiences are viewable by everyone" ON public.interview_experiences FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Signed-in users can add experiences" ON public.interview_experiences FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can update experiences" ON public.interview_experiences FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can delete experiences" ON public.interview_experiences FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Resources are viewable by everyone" ON public.resources FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Signed-in users can add resources" ON public.resources FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can update resources" ON public.resources FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can delete resources" ON public.resources FOR DELETE TO authenticated USING (auth.uid() = user_id);