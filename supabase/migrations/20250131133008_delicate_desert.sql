/*
  # Create URL Lists Schema

  1. New Tables
    - `url_lists`
      - `id` (text, primary key)
      - `name` (text)
      - `urls` (jsonb array)
      - `created_at` (timestamptz)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `url_lists` table
    - Add policies for authenticated users to manage their lists
    - Add policy for anyone to read and create shared lists
*/

CREATE TABLE IF NOT EXISTS url_lists (
  id text PRIMARY KEY,
  name text NOT NULL,
  urls jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE url_lists ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own lists
CREATE POLICY "Users can manage their own lists"
  ON url_lists
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow anyone to read shared lists
CREATE POLICY "Anyone can read shared lists"
  ON url_lists
  FOR SELECT
  TO anon
  USING (true);

-- Allow anyone to create lists
CREATE POLICY "Anyone can create lists"
  ON url_lists
  FOR INSERT
  TO anon
  WITH CHECK (true);