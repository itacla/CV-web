-- Create a table for authorized users
CREATE TABLE authorized_users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert the initial authorized user
INSERT INTO authorized_users (email) VALUES ('claudio.rava@gmail.com');
