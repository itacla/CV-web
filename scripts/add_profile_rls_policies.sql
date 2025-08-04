-- File: add_profile_rls_policies.sql
-- Description: Adds the necessary Row Level Security (RLS) policies to allow 
-- authenticated users to update their own profile information.

-- This policy allows a logged-in user to update the profile row where the
-- 'user_id' column matches their own authenticated user ID.
CREATE POLICY "Allow authenticated users to update their own profile"
ON public.profile
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- This policy allows a logged-in user to insert a profile row for themselves.
-- This is useful if a profile might not exist for a new authorized user.
CREATE POLICY "Allow authenticated users to create their own profile"
ON public.profile
FOR INSERT
WITH CHECK (auth.uid() = user_id);
