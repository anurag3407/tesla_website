-- ==============================================================================
-- TESLA TECHNICAL CLUB - COMPLETE SUPABASE POSTGRESQL SCHEMA
-- Generated for full migration to Supabase
-- Includes: Tables, Indexes, Triggers, RLS, Keep-Alive Table & Storage Buckets
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- Function to automatically update updated_at timestamp
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 1. USERS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'TeamMember',
  team TEXT DEFAULT '',
  designation TEXT DEFAULT '',
  permissions TEXT[] DEFAULT '{}',
  
  -- Academic
  roll_no TEXT DEFAULT '',
  branch TEXT DEFAULT '',
  year TEXT DEFAULT '',
  batch INT,
  
  -- Alumni
  company TEXT DEFAULT '',
  current_role TEXT DEFAULT '',
  graduation_year INT,
  location TEXT DEFAULT '',
  
  -- Profile Details
  bio TEXT DEFAULT '',
  profile_image TEXT DEFAULT '',
  portfolio TEXT DEFAULT '',
  resume TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  availability TEXT DEFAULT '',
  current_semester INT,
  cgpa TEXT DEFAULT '',
  
  -- Arrays & Structured Data
  skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  preferred_domains TEXT[] DEFAULT '{}',
  achievements JSONB DEFAULT '[]'::jsonb,
  projects JSONB DEFAULT '[]'::jsonb,
  social_links JSONB DEFAULT '{"linkedin":"","github":"","instagram":"","twitter":""}'::jsonb,
  
  -- System Flags
  is_public BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'active',
  is_verified BOOLEAN DEFAULT FALSE,
  must_change_password BOOLEAN DEFAULT FALSE,
  preferences JSONB DEFAULT '{"emailNotifications":true,"theme":"dark","coverBanner":"","openToCollaboration":false}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at DESC);

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ==============================================================================
-- 2. EVENTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  venue TEXT NOT NULL,
  speaker TEXT DEFAULT '',
  poster TEXT DEFAULT '',
  category TEXT NOT NULL,
  seat_limit INT,
  is_featured BOOLEAN DEFAULT FALSE,
  registered_users TEXT[] DEFAULT '{}',
  waitlist TEXT[] DEFAULT '{}',
  approval_status TEXT DEFAULT 'approved',
  requested_by TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  request_note TEXT DEFAULT '',
  admin_remarks TEXT DEFAULT '',
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_events_approval_status ON public.events(approval_status);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events(created_at DESC);

DROP TRIGGER IF EXISTS trg_events_updated_at ON public.events;
CREATE TRIGGER trg_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ==============================================================================
-- 3. BLOGS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.blogs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  cover_image TEXT DEFAULT '',
  is_featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'Draft',
  likes TEXT[] DEFAULT '{}',
  views INT DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blogs_status ON public.blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_author ON public.blogs(author_id);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON public.blogs(created_at DESC);

DROP TRIGGER IF EXISTS trg_blogs_updated_at ON public.blogs;
CREATE TRIGGER trg_blogs_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ==============================================================================
-- 4. ACHIEVEMENTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  team_members TEXT[] DEFAULT '{}',
  cover_image TEXT NOT NULL,
  gallery TEXT[] DEFAULT '{}',
  venue TEXT DEFAULT '',
  achievement_date TIMESTAMPTZ NOT NULL,
  organizer TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  event_link TEXT DEFAULT '',
  is_featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'Pending',
  uploaded_by TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  uploader_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_achievements_status ON public.achievements(status);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON public.achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_created_at ON public.achievements(created_at DESC);

DROP TRIGGER IF EXISTS trg_achievements_updated_at ON public.achievements;
CREATE TRIGGER trg_achievements_updated_at
  BEFORE UPDATE ON public.achievements
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ==============================================================================
-- 5. RESOURCES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.resources (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  department TEXT NOT NULL,
  semester INT NOT NULL CHECK (semester >= 1 AND semester <= 8),
  subject_name TEXT NOT NULL,
  subject_code TEXT DEFAULT '',
  files JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resources_dept_sem ON public.resources(department, semester);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON public.resources(created_at DESC);

DROP TRIGGER IF EXISTS trg_resources_updated_at ON public.resources;
CREATE TRIGGER trg_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ==============================================================================
-- 6. GALLERY TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  media_url TEXT DEFAULT '',
  album TEXT NOT NULL,
  caption TEXT DEFAULT '',
  media_type TEXT DEFAULT 'Photo',
  upload_source TEXT DEFAULT 'Direct',
  views INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_album ON public.gallery(album);
CREATE INDEX IF NOT EXISTS idx_gallery_media_type ON public.gallery(media_type);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON public.gallery(created_at DESC);

DROP TRIGGER IF EXISTS trg_gallery_updated_at ON public.gallery;
CREATE TRIGGER trg_gallery_updated_at
  BEFORE UPDATE ON public.gallery
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ==============================================================================
-- 7. TEAMS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.teams (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  lead_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  members TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_by TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teams_is_active ON public.teams(is_active);

DROP TRIGGER IF EXISTS trg_teams_updated_at ON public.teams;
CREATE TRIGGER trg_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ==============================================================================
-- 8. TEAM PROJECTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.team_projects (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  team TEXT NOT NULL,
  status TEXT DEFAULT 'Planning',
  members_involved TEXT[] DEFAULT '{}',
  created_by TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_projects_team ON public.team_projects(team);
CREATE INDEX IF NOT EXISTS idx_team_projects_created_at ON public.team_projects(created_at DESC);

DROP TRIGGER IF EXISTS trg_team_projects_updated_at ON public.team_projects;
CREATE TRIGGER trg_team_projects_updated_at
  BEFORE UPDATE ON public.team_projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ==============================================================================
-- 9. VISITS TABLE (Telemetry / Visitor Tracker)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.visits (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  path TEXT DEFAULT '/',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visits_created_at ON public.visits(created_at DESC);

-- ==============================================================================
-- 10. KEEP_ALIVE_PINGS TABLE (Prevents Supabase Free-Tier Auto-Pause)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.keep_alive_pings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  triggered_by TEXT DEFAULT 'cron',           -- 'github_action', 'vercel_cron', 'api_route', 'admin_manual'
  status TEXT DEFAULT 'healthy',
  response_time_ms INT DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_keep_alive_created_at ON public.keep_alive_pings(created_at DESC);

-- ------------------------------------------------------------------------------
-- Keep-alive telemetry view: calculates days since last ping and pause countdown
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.keep_alive_status AS
SELECT
  COUNT(*) AS total_pings,
  MAX(created_at) AS last_ping_at,
  ROUND(EXTRACT(EPOCH FROM (NOW() - COALESCE(MAX(created_at), NOW()))) / 86400, 2) AS days_since_last_ping,
  GREATEST(0, ROUND(7.0 - (EXTRACT(EPOCH FROM (NOW() - COALESCE(MAX(created_at), NOW()))) / 86400), 2)) AS days_until_auto_pause
FROM public.keep_alive_pings;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keep_alive_pings ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS automatically. For anon / authenticated clients:
-- Public reads on public content:
CREATE POLICY "Public users viewable if public" ON public.users FOR SELECT USING (is_public = true);
CREATE POLICY "Events viewable by all" ON public.events FOR SELECT USING (approval_status = 'approved');
CREATE POLICY "Published blogs viewable by all" ON public.blogs FOR SELECT USING (status = 'Published');
CREATE POLICY "Achievements viewable by all" ON public.achievements FOR SELECT USING (status = 'Published');
CREATE POLICY "Resources viewable by all" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Gallery viewable by all" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Teams viewable by all" ON public.teams FOR SELECT USING (is_active = true);
CREATE POLICY "Visits insertable by all" ON public.visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Keep alive readable by all" ON public.keep_alive_pings FOR SELECT USING (true);
CREATE POLICY "Keep alive insertable by all" ON public.keep_alive_pings FOR INSERT WITH CHECK (true);
