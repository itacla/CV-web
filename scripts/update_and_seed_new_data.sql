-- File: update_and_seed_new_data.sql
-- Description: A consolidated script to update table structure and add new data.

-- Step 1: Add 'location' and 'is_featured' columns to the experiences table
ALTER TABLE experiences
ADD COLUMN location TEXT,
ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;

-- Step 2: Update existing records to populate the new 'location' column
UPDATE experiences SET location = 'Vienna/Dublino' WHERE institution LIKE '%H3G%';
UPDATE experiences SET location = 'Novedrate (CO)' WHERE institution LIKE '%B&B Italia%';
UPDATE experiences SET location = 'Milano' WHERE institution LIKE '%i-Faber/Unicredit%';
UPDATE experiences SET location = 'Rimini' WHERE institution LIKE '%SCM Group%';
UPDATE experiences SET location = 'Milano' WHERE institution LIKE '%A.B.S. Srl%' AND title LIKE '%AB-Card%';
UPDATE experiences SET location = 'Milano' WHERE institution LIKE '%Fondazione Politecnico%';
UPDATE experiences SET location = 'Milano' WHERE institution = 'Politecnico di Milano';
UPDATE experiences SET location = 'Abbiategrasso (MI)' WHERE institution LIKE '%E. Alessandrini%';

-- Step 3: Flag the QuoliMi project as featured
UPDATE experiences SET is_featured = TRUE WHERE title = 'Co-founder' AND institution = 'QuoliMi';

-- Step 4: Insert new courses and certifications with type = 'certification'
INSERT INTO experiences (type, title, institution, description, start_date, end_date, "order")
VALUES
  (
    'certification',
    'Corso di Alta Formazione in General Management',
    'MIP - School of Management del Politecnico di Milano',
    'Executive education su strategia, marketing, finanza e organizzazione aziendale.',
    '2012-01-01',
    '2012-06-30',
    200
  ),
  (
    'certification',
    'Stage formativo in ambito ICT',
    'A.B.S. Srl',
    'Formazione pratica su sistemi ERP e project management in ambito consulenziale.',
    '2011-10-01',
    '2012-02-29',
    210
  ),
  (
    'certification',
    'Prince2® Practitioner Certificate in Project Management',
    'AXELOS Global Best Practice',
    'Certificazione riconosciuta a livello internazionale per la gestione di progetti in ambienti controllati.',
    '2025-09-01',
    NULL, -- No end date for a certification
    220
  );
