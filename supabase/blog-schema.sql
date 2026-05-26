-- Blog System Schema
-- Run this in Supabase: SQL Editor → New query → Run

-- 1. Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  excerpt text,
  author text DEFAULT 'Kanjii Team',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  tags text[] DEFAULT '{}',
  meta_title text,
  meta_description text,
  view_count integer DEFAULT 0,
  reading_time_minutes integer,
  CONSTRAINT blog_posts_slug_unique UNIQUE (slug)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx ON public.blog_posts (published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS blog_posts_status_idx ON public.blog_posts (status);
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON public.blog_posts (slug);
CREATE INDEX IF NOT EXISTS blog_posts_tags_idx ON public.blog_posts USING gin (tags);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published posts
CREATE POLICY "Published blog posts are publicly readable"
  ON public.blog_posts
  FOR SELECT
  USING (status = 'published');

-- 2. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_blog_post_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Create trigger to automatically update updated_at
CREATE TRIGGER update_blog_post_updated_at_trigger
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_blog_post_updated_at();

-- 4. Create function to increment view count
CREATE OR REPLACE FUNCTION public.increment_blog_post_views(post_slug text)
RETURNS void AS $$
BEGIN
  UPDATE public.blog_posts
  SET view_count = view_count + 1
  WHERE slug = post_slug AND status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on functions
GRANT EXECUTE ON FUNCTION public.increment_blog_post_views(text) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_blog_post_views(text) TO authenticated;
