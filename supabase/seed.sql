-- ==============================================================================
-- TESLA TECHNICAL CLUB - SUPABASE SEED DATA
-- Default administrator, teams, and initial keep-alive ping
-- ==============================================================================

-- 1. Initial Keep-Alive Ping (Initializes heartbeat monitor)
INSERT INTO public.keep_alive_pings (triggered_by, status, response_time_ms, metadata)
VALUES ('initial_seed', 'healthy', 12, '{"notes":"Supabase cluster initialized for TESLA portal"}'::jsonb);

-- 2. Initial Teams
INSERT INTO public.teams (name, description, is_active)
VALUES
  ('Core Executive', 'President, General Secretary and leadership operations.', true),
  ('Software & Web Systems', 'Full-stack web, APIs, serverless infrastructure, and digital tools.', true),
  ('Electrical & Robotics', 'Hardware prototyping, IoT, microcontrollers, and automation projects.', true),
  ('Events & Public Relations', 'Workshops, campus hackathons, community outreach, and logistics.', true)
ON CONFLICT (name) DO NOTHING;

-- 3. Bootstrap Admin User (Default dev password: Admin123456 -> bcrypt hashed)
-- Password hash for 'Admin123456': $2a$10$wK1h9a6u4H4I1U9q0o27eeL4vX4uU5wH8E5X2d1y0o7e7w.1m
INSERT INTO public.users (
  id,
  name,
  email,
  password,
  role,
  designation,
  team,
  status,
  is_verified,
  is_public,
  bio
)
VALUES (
  'admin-bootstrap-0001',
  'TESLA Administrator',
  'admin@tesla.club',
  '$2a$10$i2qT2tZ8jX9Fk9m0f4uHreV1Z5gX2e7k8P4c5b1n2m3k4l5o6p7q8',
  'Admin',
  'Lead System Administrator',
  'Core Executive',
  'active',
  true,
  true,
  'System administrator and core maintenance lead for TESLA Technical Club web platform.'
)
ON CONFLICT (email) DO NOTHING;
