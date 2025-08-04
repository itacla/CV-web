-- File: rename_and_update_skill_category.sql
-- Description: Renames the 'soft' skill category to 'personal' and updates existing data.

-- Step 1: Rename the ENUM value type.
-- This is the standard way to rename a value in an ENUM type in PostgreSQL.
-- It will automatically apply to all existing rows using this type.
ALTER TYPE public.skill_category RENAME VALUE 'soft' TO 'personal';

-- Note: The above command handles the data update for existing rows.
-- No separate UPDATE statement is needed for the category column itself.
