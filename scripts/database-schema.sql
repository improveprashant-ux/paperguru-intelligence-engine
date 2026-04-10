-- CBSE Exam Papers Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create exam_papers table
CREATE TABLE IF NOT EXISTS exam_papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_code VARCHAR(10) NOT NULL,
  subject_name VARCHAR(100),
  set_code VARCHAR(10),
  paper_number VARCHAR(10),
  sub_paper VARCHAR(10),
  year INT DEFAULT 2025,
  category VARCHAR(50),
  file_path TEXT,
  raw_text TEXT,
  UNIQUE(subject_code, set_code, paper_number, sub_paper)
);

-- Enable RLS (Row Level Security)
ALTER TABLE exam_papers ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON exam_papers
  FOR SELECT USING (true);

-- Allow anon service role write access  
CREATE POLICY "Allow anon insert" ON exam_papers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anon update" ON exam_papers
  FOR UPDATE USING (true);

-- Optional: Update questions table to reference papers
-- ALTER TABLE questions ADD COLUMN source_paper_id UUID REFERENCES exam_papers(id);

-- Check table exists
SELECT COUNT(*) as total_papers FROM exam_papers;