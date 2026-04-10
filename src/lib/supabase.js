import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yunttovbdqwvqcifmrvg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVudHRvdmJkcXd2cWNpZm1ydmciLCJpYXQiOjE3NDMyMzUwNDIsInVzZXIiOiJhbm9uIn0.LrH86O0U0n99O3kH4mVQyqdGdHCmC5eWJN3K3X6J0Z8';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchQuestionsBySubject(subject) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('subject', subject)
      .order('year_last_seen', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('Supabase fetch failed, using local data:', error);
    return null;
  }
}

export async function fetchQuestionsByTopic(subject, topic) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('subject', subject)
      .eq('topic', topic)
      .limit(50);

    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('Supabase fetch failed:', error);
    return null;
  }
}

export async function fetchQuestionsByDifficulty(subject, difficulty) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('subject', subject)
      .eq('difficulty', difficulty)
      .limit(50);

    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('Supabase fetch failed:', error);
    return null;
  }
}

export async function fetchLatestQuestions(subject, year = 2026) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('subject', subject)
      .gte('year_last_seen', year)
      .order('year_last_seen', { ascending: false })
      .limit(30);

    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('Supabase fetch failed:', error);
    return null;
  }
}

export async function fetchAllQuestions() {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .limit(500);

    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('Supabase fetch failed:', error);
    return null;
  }
}

export async function saveUserWeakAreas(userId, weakAreas) {
  try {
    const { error } = await supabase
      .from('user_weak_areas')
      .upsert({ user_id: userId, weak_areas: weakAreas, updated_at: new Date().toISOString() });

    if (error) throw error;
    return true;
  } catch (error) {
    console.warn('Failed to save weak areas:', error);
    const existing = JSON.parse(localStorage.getItem('userWeakAreas') || '{}');
    existing[userId] = weakAreas;
    localStorage.setItem('userWeakAreas', JSON.stringify(existing));
    return false;
  }
}

export async function getUserWeakAreas(userId) {
  try {
    const { data, error } = await supabase
      .from('user_weak_areas')
      .select('weak_areas')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data?.weak_areas || [];
  } catch (error) {
    const existing = JSON.parse(localStorage.getItem('userWeakAreas') || '{}');
    return existing[userId] || [];
  }
}

export async function uploadQuestions(questions) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .upsert(questions, { onConflict: 'id' });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Upload failed:', error);
    return { success: false, error };
  }
}

export async function fetchExamPapers(subject = null) {
  try {
    let query = supabase
      .from('exam_papers')
      .select('*')
      .order('year', { ascending: false });

    if (subject) {
      query = query.ilike('subject_name', `%${subject}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('Failed to fetch exam papers:', error);
    return [];
  }
}

export async function fetchPaperTextForAI(subject) {
  try {
    const { data, error } = await supabase
      .from('exam_papers')
      .select('set_code, paper_number, raw_text, category')
      .ilike('subject_name', `%${subject}%`)
      .order('year', { ascending: false })
      .limit(3);

    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('Failed to fetch paper text:', error);
    return [];
  }
}

export async function getPaperStats() {
  try {
    const { count } = await supabase
      .from('exam_papers')
      .select('*', { count: 'exact', head: true });

    const bySubject = await supabase
      .from('exam_papers')
      .select('subject_name');

    const subjectCounts = {};
    if (bySubject.data) {
      bySubject.data.forEach(p => {
        subjectCounts[p.subject_name] = (subjectCounts[p.subject_name] || 0) + 1;
      });
    }

    return { total: count || 0, bySubject: subjectCounts };
  } catch (error) {
    return { total: 0, bySubject: {} };
  }
}