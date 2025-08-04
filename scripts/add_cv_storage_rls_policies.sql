-- File: add_cv_storage_rls_policies.sql
-- Description: Adds RLS policies for the 'cv-documents' storage bucket.

-- 1. Public Read Access
CREATE POLICY "Allow public read access to CVs"
ON storage.objects
FOR SELECT
USING (bucket_id = 'cv-documents');

-- 2. Authenticated Uploads (INSERT)
CREATE POLICY "Allow authenticated users to upload their own CV"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'cv-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 3. Authenticated Updates
CREATE POLICY "Allow authenticated users to update their own CV"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'cv-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 4. Authenticated Deletes
CREATE POLICY "Allow authenticated users to delete their own CV"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'cv-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
