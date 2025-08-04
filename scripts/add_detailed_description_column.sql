-- File: add_detailed_description_column.sql
-- Description: Adds a column for the extended description of an experience.

-- Step 1: Add the new 'detailed_description' column to the table
ALTER TABLE experiences
ADD COLUMN detailed_description TEXT;

-- Step 2: Populate the new column with the existing short description as a placeholder.
-- This allows the functionality to be built. The content can be updated later.
UPDATE experiences
SET detailed_description = description;
