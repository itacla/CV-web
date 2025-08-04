-- File: add_cv_url_to_profile.sql
-- Description: Adds a cv_url column to the profile table to store the CV file URL.

ALTER TABLE public.profile
ADD COLUMN cv_url TEXT;

COMMENT ON COLUMN public.profile.cv_url IS 'URL to the user-uploaded CV PDF, hosted on Supabase Storage.';
