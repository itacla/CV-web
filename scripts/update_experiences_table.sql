-- File: update_experiences_table.sql
-- Description: Adds a location column to the experiences table and populates it.

-- 1. Add the new 'location' column to the table
ALTER TABLE experiences
ADD COLUMN location TEXT;

-- 2. Update existing records to populate the new column
-- Note: This is a best-effort update based on the current data.
-- These might need manual adjustment in the Supabase UI for full accuracy.
UPDATE experiences SET location = 'Vienna/Dublino' WHERE institution LIKE '%H3G%';
UPDATE experiences SET location = 'Novedrate (CO)' WHERE institution LIKE '%B&B Italia%';
UPDATE experiences SET location = 'Milano' WHERE institution LIKE '%i-Faber/Unicredit%';
UPDATE experiences SET location = 'Rimini' WHERE institution LIKE '%SCM Group%';
UPDATE experiences SET location = 'Milano' WHERE institution LIKE '%A.B.S. Srl%' AND title LIKE '%AB-Card%';
UPDATE experiences SET location = 'Milano' WHERE institution LIKE '%Fondazione Politecnico%';
UPDATE experiences SET location = 'Milano' WHERE institution LIKE '%QuoliMi%';
UPDATE experiences SET location = 'Milano' WHERE institution = 'Politecnico di Milano';
UPDATE experiences SET location = 'Abbiategrasso (MI)' WHERE institution LIKE '%E. Alessandrini%';

-- 3. (Optional but recommended) Clean up the institution field
-- This removes the location part from the institution name where it was duplicated.
UPDATE experiences SET institution = 'A.B.S. Srl (presso H3G)' WHERE institution = 'A.B.S. Srl (presso H3G Vienna/Dublino)';
UPDATE experiences SET institution = 'A.B.S. Srl (presso SopraGroup/B&B Italia)' WHERE institution = 'A.B.S. Srl (presso SopraGroup/B&B Italia)'; -- No change needed if you want to keep it
UPDATE experiences SET institution = 'A.B.S. Srl (presso i-Faber/Unicredit)' WHERE institution = 'A.B.S. Srl (presso i-Faber/Unicredit)'; -- No change needed
UPDATE experiences SET institution = 'A.B.S. Srl (presso Reply/SCM Group)' WHERE institution = 'A.B.S. Srl (presso Reply/SCM Group)'; -- No change needed
