-- File: seed.sql
-- Description: Populates the database with initial data from the CV.

-- Make sure to run setup.sql before running this script.

-- 1. POPULATE PROFILE TABLE
-- Using data from the "Informazioni Personali" section of the CV.
INSERT INTO profile (full_name, professional_title, bio, contact_email, contact_phone, linkedin_url, github_url)
VALUES (
  'Claudio Rava',
  'Consulente ICT, Project Manager & Product Developer',
  'Consulenza informatica ad alto contenuto tecnologico. Sviluppo business e prodotto in progetti ad alto tasso di innovazione. Gestione di progetti e soluzioni in ambito ERP, web e mobile.',
  'claudio.rava@gmail.com',
  '+393387301536',
  'http://it.linkedin.com/in/claudiorava',
  NULL -- No GitHub URL provided in the CV
);

-- 2. POPULATE EXPERIENCES TABLE
-- Using data from "Esperienza Professionale" and "Istruzione e Formazione".
-- Dates are in 'YYYY-MM-DD' format.
INSERT INTO experiences (type, title, institution, description, start_date, end_date, "order")
VALUES
  ('work', 'PMO e Quality Assurance per Accenture', 'A.B.S. Srl (presso H3G Vienna/Dublino)', 'Programma di coordinamento e quality assurance per la Global Single Instance (GSI) di H3G. Merge operatori, upgrade sistema, change management.', '2013-10-01', NULL, 10),
  ('work', 'Oracle EBS Manufacturing Consultant', 'A.B.S. Srl (presso SopraGroup/B&B Italia)', 'Implementazione e manutenzione evolutiva delle funzionalità di Manufacturing (INV, WIP, BOM, PO, ASCP) di Oracle EBS.', '2013-10-01', NULL, 20),
  ('work', 'Quality Assurance Analyst', 'A.B.S. Srl (presso i-Faber/Unicredit)', 'Consulenza, analisi e controllo della qualità del software della piattaforma di e-Procurement. Automazione test.', '2013-01-01', '2013-09-30', 30),
  ('work', 'Oracle EBS Consultant', 'A.B.S. Srl (presso Reply/SCM Group)', 'Implementazione delle funzionalità di manufacturing (WIP, BOM, INV, PO) di Oracle E-business Suite.', '2012-09-01', '2012-12-31', 40),
  ('work', 'Project Manager & Analyst', 'A.B.S. Srl', 'Progetto SaaS "AB-Card - Carte della salute". Analisi di mercato, requisiti, supporto allo sviluppo e gestione cliente.', '2012-03-01', '2012-07-31', 50),
  ('work', 'Junior Analyst', 'Fondazione Politecnico di Milano', 'Progetti "Gestione Atti Caratteristici" per Regione Lombardia e "Albo Pretorio Online" per Provincia di Perugia.', '2010-10-01', '2011-12-31', 60),
  ('work', 'Co-founder', 'QuoliMi', 'Servizio web basato su OpenData del Comune di Milano per la valutazione immobiliare. Vincitore del concorso App4Mi 2013.', '2013-07-01', NULL, 70),
  ('education', 'Laurea Magistrale in Ingegneria Gestionale', 'Politecnico di Milano', 'Specializzazione in e-Business & ICT Strategy. Votazione: 98/110.', '2009-09-01', '2011-10-31', 80),
  ('education', 'Laurea in Ingegneria Gestionale', 'Politecnico di Milano', 'Tesi su Business Game e simulazione di gestione aziendale.', '2005-09-01', '2009-07-31', 90),
  ('education', 'Diploma di Liceo Scientifico Tecnologico', 'Istituto Superiore E. Alessandrini', 'Indirizzo sperimentale.', '2000-09-01', '2005-06-30', 100);

-- 3. POPULATE SKILLS TABLE
-- Using data from "Competenze" sections. Weight is on a 1-5 scale.
INSERT INTO skills (name, category, weight)
VALUES
  -- Technical
  ('SQL & PL-SQL', 'technical', 5),
  ('Oracle EBS', 'technical', 5),
  ('HTML & CSS', 'technical', 4),
  ('Software Testing', 'technical', 4),
  ('Wordpress/Drupal', 'technical', 3),
  ('C/C++', 'technical', 2),
  ('Photoshop', 'technical', 3),
  ('Selenium IDE', 'technical', 4),

  -- Managerial
  ('Project Management', 'managerial', 5),
  ('Product Development', 'managerial', 5),
  ('Business Planning', 'managerial', 4),
  ('Team Management', 'managerial', 4),
  ('Quality Assurance', 'managerial', 5),
  ('Analisi Funzionale', 'managerial', 5),

  -- Soft
  ('Teamwork', 'soft', 5),
  ('Problem Solving', 'soft', 5),
  ('Leadership', 'soft', 4),
  ('Proattività', 'soft', 5),
  ('Pianificazione', 'soft', 4);