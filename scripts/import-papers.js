import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import pdf from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = 'https://yunttovbdqwvqcifmrvg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVudHRvdmJkcXd2cWNpZm1ydmciLCJpYXQiOjE3NDMyMzUwNDIsInVzZXIiOiJhbm9uIn0.LrH86O0U0n99O3kH4mVQyqdGdHCmC5eWJN3K3X6J0Z8';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SUBJECT_MAPPING = {
  '086_Science': { code: '086', name: 'Science' },
  '002_Hindi_Course_A': { code: '002', name: 'Hindi Course A' },
  '087_Social_Science': { code: '087', name: 'Social Science' },
  '241_Mathematics_Basic': { code: '241', name: 'Mathematics Basic' }
};

function parseFilename(filename, folderPath) {
  const baseName = path.basename(filename, '.pdf');
  
  const folderName = path.basename(path.dirname(filename));
  const subjectInfo = SUBJECT_MAPPING[folderName] || { code: '000', name: folderName };
  
  const viMatch = baseName.match(/Visually Impaired/i);
  if (viMatch) {
    const nameMatch = baseName.match(/^(.+?)(?:\s*for\s+Visually|$)/i);
    const subjectName = nameMatch ? nameMatch[1].trim().replace(/\s*\(\w\)\s*$/, '') : subjectInfo.name;
    return {
      subject_code: subjectInfo.code,
      subject_name: subjectName,
      set_code: null,
      paper_number: null,
      sub_paper: null,
      category: 'Visually Impaired',
      year: 2025
    };
  }
  
  const pattern3Match = baseName.match(/^(\d{2,3})-(\d)-(\d)_(.+)$/);
  if (pattern3Match) {
    return {
      subject_code: subjectInfo.code,
      subject_name: pattern3Match[4].trim(),
      set_code: pattern3Match[1],
      paper_number: pattern3Match[2],
      sub_paper: pattern3Match[3],
      category: 'Standard',
      year: 2025
    };
  }
  
  const pattern2Match = baseName.match(/^(\d{2,3})[_-](\d)[_-](\d)_(.+)$/);
  if (pattern2Match) {
    return {
      subject_code: subjectInfo.code,
      subject_name: pattern2Match[4].trim(),
      set_code: pattern2Match[1],
      paper_number: pattern2Match[2],
      sub_paper: pattern2Match[3],
      category: 'Standard',
      year: 2025
    };
  }
  
  return {
    subject_code: subjectInfo.code,
    subject_name: baseName,
    set_code: null,
    paper_number: null,
    sub_paper: null,
    category: 'Unknown',
    year: 2025
  };
}

async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error(`Error extracting text from ${filePath}:`, error.message);
    return null;
  }
}

async function processPDF(filePath) {
  console.log(`\n📄 Processing: ${path.basename(filePath)}`);
  
  const metadata = parseFilename(filePath, path.dirname(path.dirname(filePath)));
  console.log(`   Subject: ${metadata.subject_name} (${metadata.subject_code})`);
  console.log(`   Set: ${metadata.set_code || 'N/A'}, Paper: ${metadata.paper_number || 'N/A'}, Sub: ${metadata.sub_paper || 'N/A'}`);
  
  const rawText = await extractTextFromPDF(filePath);
  if (rawText) {
    console.log(`   ✓ Extracted ${rawText.length} characters`);
  } else {
    console.log(`   ⚠ Failed to extract text`);
  }
  
  const paperData = {
    subject_code: metadata.subject_code,
    subject_name: metadata.subject_name,
    set_code: metadata.set_code,
    paper_number: metadata.paper_number,
    sub_paper: metadata.sub_paper,
    year: metadata.year,
    category: metadata.category,
    file_path: filePath,
    raw_text: rawText
  };
  
  const { data, error } = await supabase
    .from('exam_papers')
    .upsert(paperData, { 
      onConflict: 'subject_code,set_code,paper_number,sub_paper',
      ignoreDuplicates: true 
    });

  if (error) {
    console.error(`   ❌ Database error:`, error.message);
    return false;
  }
  
  console.log(`   ✅ Imported to database`);
  return true;
}

async function scanDirectory(dirPath) {
  const pdfFiles = [];
  
  if (!fs.existsSync(dirPath)) {
    console.error(`Directory not found: ${dirPath}`);
    return pdfFiles;
  }
  
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);
    
    if (item.isDirectory()) {
      const subFiles = await scanDirectory(fullPath);
      pdfFiles.push(...subFiles);
    } else if (item.name.toLowerCase().endsWith('.pdf')) {
      pdfFiles.push(fullPath);
    }
  }
  
  return pdfFiles;
}

async function main() {
  console.log('🔄 CBSE Exam Paper Import Script');
  console.log('=====================================\n');
  
  console.log('📋 Checking if exam_papers table exists...');
  
  const { error: checkError } = await supabase
    .from('exam_papers')
    .select('id')
    .limit(1);
  
  if (checkError) {
    console.error('\n❌ Table "exam_papers" does not exist!');
    console.log('Please run this SQL in your Supabase dashboard:\n');
    console.log(`
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
    `.trim());
    process.exit(1);
  }
  
  console.log('✓ Table exists\n');
  
  const baseDir = 'C:\\Users\\maa\\New folder (3)\\PAPER LEAKER\\extracted_data';
  console.log(`📂 Scanning: ${baseDir}\n`);
  
  const pdfFiles = await scanDirectory(baseDir);
  console.log(`📊 Found ${pdfFiles.length} PDF files\n`);
  
  if (pdfFiles.length === 0) {
    console.log('❌ No PDF files found!');
    process.exit(1);
  }
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < pdfFiles.length; i++) {
    console.log(`\n[${i + 1}/${pdfFiles.length}]`);
    const success = await processPDF(pdfFiles[i]);
    if (success) successCount++;
    else failCount++;
  }
  
  console.log('\n=====================================');
  console.log('📈 Import Summary');
  console.log('=====================================');
  console.log(`Total files: ${pdfFiles.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log('=====================================\n');
  
  const { data: count } = await supabase
    .from('exam_papers')
    .select('subject_name', { count: 'exact', head: true });
  
  console.log(`📚 Total papers in database: ${count?.length || 0}`);
}

main().catch(console.error);