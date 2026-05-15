# Supabase Setup Guide for UR COMICS

This guide walks you through setting up Supabase as the backend for UR COMICS.

## Prerequisites

- A free Supabase account at https://supabase.com
- Node.js 18+ and pnpm installed
- A GitHub account (for Vercel deployment)

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Choose your organization, enter project name `ur-comics`, set a database password, and select a region
4. Wait for the project to initialize (about 1–2 minutes)

## Step 2: Run Database Migrations

Go to your Supabase project dashboard → **SQL Editor** and run the following SQL scripts in order:

### 2a. Create Tables

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  handle TEXT UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  is_creator BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comics table
CREATE TABLE public.comics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  is_published BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chapters table
CREATE TABLE public.chapters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  comic_id UUID REFERENCES public.comics(id) ON DELETE CASCADE NOT NULL,
  chapter_number FLOAT NOT NULL,
  title TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comic_id, chapter_number)
);

-- Chapter pages table
CREATE TABLE public.chapter_pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE NOT NULL,
  page_number INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(chapter_id, page_number)
);

-- Genres table
CREATE TABLE public.genres (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comic-Genre junction table
CREATE TABLE public.comic_genres (
  comic_id UUID REFERENCES public.comics(id) ON DELETE CASCADE,
  genre_id UUID REFERENCES public.genres(id) ON DELETE CASCADE,
  PRIMARY KEY (comic_id, genre_id)
);

-- Likes table
CREATE TABLE public.likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  comic_id UUID REFERENCES public.comics(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, comic_id)
);

-- Comments table
CREATE TABLE public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  comic_id UUID REFERENCES public.comics(id) ON DELETE CASCADE NOT NULL,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Follows table
CREATE TABLE public.follows (
  follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

-- Bookmarks / reading history
CREATE TABLE public.bookmarks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  comic_id UUID REFERENCES public.comics(id) ON DELETE CASCADE NOT NULL,
  last_chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
  last_page_number INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, comic_id)
);
```

### 2b. Create Indexes

```sql
CREATE INDEX idx_comics_author_id ON public.comics(author_id);
CREATE INDEX idx_comics_is_published ON public.comics(is_published);
CREATE INDEX idx_chapters_comic_id ON public.chapters(comic_id);
CREATE INDEX idx_chapter_pages_chapter_id ON public.chapter_pages(chapter_id);
CREATE INDEX idx_comic_genres_genre_id ON public.comic_genres(genre_id);
CREATE INDEX idx_likes_comic_id ON public.likes(comic_id);
CREATE INDEX idx_comments_comic_id ON public.comments(comic_id);
CREATE INDEX idx_bookmarks_user_id ON public.bookmarks(user_id);
```

### 2c. Seed Genres

```sql
INSERT INTO public.genres (name, slug) VALUES
  ('Action', 'action'),
  ('Adventure', 'adventure'),
  ('Comedy', 'comedy'),
  ('Sci-Fi', 'sci-fi'),
  ('Fantasy', 'fantasy'),
  ('Romance', 'romance'),
  ('Horror', 'horror'),
  ('Drama', 'drama'),
  ('Mystery', 'mystery'),
  ('Thriller', 'thriller'),
  ('Slice of Life', 'slice-of-life'),
  ('Martial Arts', 'martial-arts'),
  ('Supernatural', 'supernatural'),
  ('Psychological', 'psychological');
```

### 2d. Enable Row Level Security

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapter_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comic_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Users: public read, own write
CREATE POLICY "Public users are viewable" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Comics: published comics public, creators own their comics
CREATE POLICY "Published comics are viewable" ON public.comics FOR SELECT USING (is_published = true OR auth.uid() = author_id);
CREATE POLICY "Creators can insert comics" ON public.comics FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Creators can update own comics" ON public.comics FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Creators can delete own comics" ON public.comics FOR DELETE USING (auth.uid() = author_id);

-- Chapters: published chapters public
CREATE POLICY "Published chapters viewable" ON public.chapters FOR SELECT USING (
  is_published = true OR
  EXISTS (SELECT 1 FROM public.comics WHERE id = comic_id AND author_id = auth.uid())
);
CREATE POLICY "Creators can manage chapters" ON public.chapters FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.comics WHERE id = comic_id AND author_id = auth.uid())
);
CREATE POLICY "Creators can update chapters" ON public.chapters FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.comics WHERE id = comic_id AND author_id = auth.uid())
);
CREATE POLICY "Creators can delete chapters" ON public.chapters FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.comics WHERE id = comic_id AND author_id = auth.uid())
);

-- Chapter pages: same as chapters
CREATE POLICY "Chapter pages viewable" ON public.chapter_pages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.chapters ch
    JOIN public.comics c ON c.id = ch.comic_id
    WHERE ch.id = chapter_id AND (ch.is_published = true OR c.author_id = auth.uid())
  )
);
CREATE POLICY "Creators can manage chapter pages" ON public.chapter_pages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chapters ch
    JOIN public.comics c ON c.id = ch.comic_id
    WHERE ch.id = chapter_id AND c.author_id = auth.uid()
  )
);
CREATE POLICY "Creators can delete chapter pages" ON public.chapter_pages FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.chapters ch
    JOIN public.comics c ON c.id = ch.comic_id
    WHERE ch.id = chapter_id AND c.author_id = auth.uid()
  )
);

-- Genres: public read only
CREATE POLICY "Genres are viewable" ON public.genres FOR SELECT USING (true);

-- Comic genres: public read
CREATE POLICY "Comic genres are viewable" ON public.comic_genres FOR SELECT USING (true);
CREATE POLICY "Creators can manage comic genres" ON public.comic_genres FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.comics WHERE id = comic_id AND author_id = auth.uid())
);
CREATE POLICY "Creators can remove comic genres" ON public.comic_genres FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.comics WHERE id = comic_id AND author_id = auth.uid())
);

-- Likes: auth required
CREATE POLICY "Likes are viewable" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Users can like" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- Comments: public read, auth write
CREATE POLICY "Comments are viewable" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can comment" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Follows
CREATE POLICY "Follows are viewable" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can follow" ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow" ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- Bookmarks
CREATE POLICY "Users can see own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update bookmarks" ON public.bookmarks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete bookmarks" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);
```

### 2e. Auto-create user profile on signup

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, handle)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    lower(regexp_replace(split_part(NEW.email, '@', 1), '[^a-zA-Z0-9]', '_', 'g'))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Step 3: Configure Storage Buckets

Go to **Storage** in your Supabase dashboard and create these buckets:

1. **comics** — for cover images and chapter pages
   - Make it **Public**
   - Allowed MIME types: `image/*`
   - Max file size: 50 MB

2. **avatars** — for user profile pictures
   - Make it **Public**
   - Allowed MIME types: `image/*`
   - Max file size: 5 MB

Then run this SQL to set storage policies:

```sql
-- Comics bucket: public read, auth upload
CREATE POLICY "Public comic images viewable" ON storage.objects FOR SELECT USING (bucket_id = 'comics');
CREATE POLICY "Authenticated users can upload comics" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'comics' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own uploads" ON storage.objects FOR UPDATE USING (bucket_id = 'comics' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own uploads" ON storage.objects FOR DELETE USING (bucket_id = 'comics' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Avatars bucket
CREATE POLICY "Public avatars viewable" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Step 4: Get Your API Keys

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the **Project URL** (e.g., `https://abcdef.supabase.co`)
3. Copy the **anon public** key

## Step 5: Configure Environment Variables

### For local development

Create a file called `.env.local` in the `src/frontend/` directory:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### For Vercel deployment

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
3. Redeploy the project

## Step 6: Configure Auth Redirect URLs

In your Supabase dashboard → **Authentication** → **URL Configuration**:

- **Site URL**: `https://your-vercel-app.vercel.app` (or your custom domain)
- **Redirect URLs**: Add your Vercel URL + `/auth/callback`

## Step 7: Deploy to Vercel

1. Push this repository to GitHub
2. Import the project in Vercel
3. Set the **Root Directory** to `src/frontend` (or configure as needed)
4. Add the environment variables from Step 5
5. Deploy!

## Troubleshooting

| Symptom | Fix |
|---|---|
| Sign In button does nothing | Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in Vercel environment variables |
| "Missing Supabase environment variables" warning | Add env vars to `src/frontend/.env.local` for local dev |
| Auth redirects broken | Ensure your site URL is configured in Supabase Auth → URL Configuration |
| Images not loading | Ensure storage buckets are set to Public and all storage policies are applied |
| Handle already taken on signup | The auto-trigger generates a handle from the email prefix; update it manually in the users table |
