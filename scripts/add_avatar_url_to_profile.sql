-- File: add_avatar_url_to_profile.sql
-- Description: Adds an avatar_url column to the profile table to store the profile image URL.

ALTER TABLE public.profile
ADD COLUMN avatar_url TEXT;

COMMENT ON COLUMN public.profile.avatar_url IS 'URL to the user-uploaded profile picture, hosted on Supabase Storage.';
