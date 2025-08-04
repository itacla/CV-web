-- Aggiunge le colonne 'role' e 'activities' alla tabella 'experiences'
-- per memorizzare informazioni più dettagliate sul ruolo ricoperto e sulle attività svolte.

ALTER TABLE public.experiences
ADD COLUMN IF NOT EXISTS role TEXT,
ADD COLUMN IF NOT EXISTS activities TEXT;

COMMENT ON COLUMN public.experiences.role IS 'Il ruolo specifico ricoperto durante l''esperienza (es. Sviluppatore Frontend, Project Manager).';
COMMENT ON COLUMN public.experiences.activities IS 'Un elenco o una descrizione dettagliata delle attività e responsabilità principali.';
