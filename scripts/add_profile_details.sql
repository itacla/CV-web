-- File: add_profile_details.sql
-- Description: Adds date_of_birth, nationality, and website_url to the profile table.

ALTER TABLE public.profile
ADD COLUMN date_of_birth DATE,
ADD COLUMN nationality TEXT,
ADD COLUMN website_url TEXT;

COMMENT ON COLUMN public.profile.date_of_birth IS 'User''s date of birth to calculate age dynamically.';
COMMENT ON COLUMN public.profile.nationality IS 'User''s nationality.';
COMMENT ON COLUMN public.profile.website_url IS 'User''s personal or professional website URL.';
