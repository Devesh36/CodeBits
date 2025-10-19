-- Create snippets table
CREATE TABLE public.snippets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  summary TEXT,
  is_public BOOLEAN DEFAULT false,
  stars INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.snippets ENABLE ROW LEVEL SECURITY;

-- Policies for snippets
CREATE POLICY "Users can view their own snippets"
ON public.snippets
FOR SELECT
USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create their own snippets"
ON public.snippets
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own snippets"
ON public.snippets
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own snippets"
ON public.snippets
FOR DELETE
USING (auth.uid() = user_id);

-- Create snippet_stars table for tracking stars
CREATE TABLE public.snippet_stars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  snippet_id UUID NOT NULL REFERENCES public.snippets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(snippet_id, user_id)
);

-- Enable RLS
ALTER TABLE public.snippet_stars ENABLE ROW LEVEL SECURITY;

-- Policies for snippet_stars
CREATE POLICY "Anyone can view stars"
ON public.snippet_stars
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can star snippets"
ON public.snippet_stars
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unstar their own stars"
ON public.snippet_stars
FOR DELETE
USING (auth.uid() = user_id);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  is_pro BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles
FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update snippet stars count
CREATE OR REPLACE FUNCTION public.update_snippet_stars()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.snippets
    SET stars = stars + 1
    WHERE id = NEW.snippet_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.snippets
    SET stars = stars - 1
    WHERE id = OLD.snippet_id;
  END IF;
  RETURN NULL;
END;
$$;

-- Trigger to update stars count
CREATE TRIGGER on_snippet_star_change
  AFTER INSERT OR DELETE ON public.snippet_stars
  FOR EACH ROW EXECUTE FUNCTION public.update_snippet_stars();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for snippets updated_at
CREATE TRIGGER update_snippets_updated_at
  BEFORE UPDATE ON public.snippets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();