-- File: add_storage_rls_policies.sql
-- Description: Adds the necessary Row Level Security (RLS) policies for the 'avatars' storage bucket.
-- This allows users to manage their own profile picture while keeping the bucket secure.

-- 1. Policy for Public Read Access
-- Allows anyone to view the images in the bucket. This is necessary for the public website to display the profile picture.
CREATE POLICY "Allow public read access to avatars"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

-- 2. Policy for Authenticated Uploads (INSERT)
-- Allows a logged-in user to upload a file into a folder that matches their user ID.
-- The client-side code creates a path like '{user_id}/profile.jpg'.
-- This policy ensures that a user cannot upload files into another user's folder.
CREATE POLICY "Allow authenticated users to upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 3. Policy for Authenticated Updates
-- Allows a logged-in user to update/overwrite their own existing files.
CREATE POLICY "Allow authenticated users to update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 4. Policy for Authenticated Deletes
-- Allows a logged-in user to delete their own files.
CREATE POLICY "Allow authenticated users to delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
