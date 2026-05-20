import { supabase } from './supabase';
import { Student, ExamResult, Interview, Scholarship, ReviewStatus, AdmissionStatus, InterviewStatus } from '@/types';

// ─── Students ────────────────────────────────────────────────────────────────
export async function fetchStudents(): Promise<Student[]> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[API] fetchStudents error:', error.message);
    throw new Error(error.message);
  }
  return (data ?? []) as Student[];
}

// ─── Exam Results ─────────────────────────────────────────────────────────────
export async function fetchExamResults(): Promise<ExamResult[]> {
  const { data, error } = await supabase
    .from('exam_details') // Make sure it matches 'exam_details' table name
    .select('*')
    .order('completed_at', { ascending: false });

  if (error) {
    // Fallback try 'exam_results'
    const { data: altData, error: altError } = await supabase
      .from('exam_results')
      .select('*')
      .order('completed_at', { ascending: false });
    
    if (altError) {
      console.error('[API] fetchExamResults error:', error.message);
      throw new Error(error.message);
    }
    return (altData ?? []) as ExamResult[];
  }
  return (data ?? []) as ExamResult[];
}

// ─── Interviews ───────────────────────────────────────────────────────────────
export async function fetchInterviews(): Promise<Interview[]> {
  const { data, error } = await supabase
    .from('interview')
    .select('*');

  if (error) {
    // Fallback try 'interviews'
    const { data: altData, error: altError } = await supabase
      .from('interviews')
      .select('*');
    if (altError) {
      console.error('[API] fetchInterviews error:', error.message);
      return [];
    }
    return (altData ?? []) as Interview[];
  }
  return (data ?? []) as Interview[];
}

// ─── Scholarships ─────────────────────────────────────────────────────────────
export async function fetchScholarships(): Promise<Scholarship[]> {
  const { data, error } = await supabase
    .from('scholarship')
    .select('*');

  if (error) {
    // Fallback try 'scholarships'
    const { data: altData, error: altError } = await supabase
      .from('scholarships')
      .select('*');
    if (altError) {
      console.error('[API] fetchScholarships error:', error.message);
      return [];
    }
    return (altData ?? []) as Scholarship[];
  }
  return (data ?? []) as Scholarship[];
}

// ─── Mutate Review/Admission Status ───────────────────────────────────────────
export async function updateStudentStatus(
  studentId: string,
  updates: Partial<Student>
): Promise<void> {
  const { error } = await supabase
    .from('students')
    .update(updates)
    .eq('id', studentId);

  if (error) {
    console.error('[API] updateStudentStatus error:', error.message);
    throw new Error(error.message);
  }
}

// ─── Create or Update Interview ──────────────────────────────────────────────
export async function upsertInterview(
  interview: Partial<Interview>
): Promise<void> {
  const table = 'interview'; // or fallback to interviews
  const { error } = await supabase
    .from(table)
    .upsert(interview);

  if (error) {
    // Fallback to interviews
    const { error: altError } = await supabase
      .from('interviews')
      .upsert(interview);
    if (altError) {
      console.error('[API] upsertInterview error:', altError.message);
      throw new Error(altError.message);
    }
  }
}

// ─── Update Scholarship ──────────────────────────────────────────────────────
export async function updateScholarshipStatus(
  id: string,
  approval_status: string,
  amount?: number
): Promise<void> {
  const table = 'scholarship';
  const updates: Record<string, any> = { approval_status };
  if (amount !== undefined) updates.amount = amount;

  const { error } = await supabase
    .from(table)
    .update(updates)
    .eq('id', id);

  if (error) {
    const { error: altError } = await supabase
      .from('scholarships')
      .update(updates)
      .eq('id', id);
    if (altError) {
      console.error('[API] updateScholarshipStatus error:', altError.message);
      throw new Error(altError.message);
    }
  }
}

// ─── Helper ───────────────────────────────────────────────────────────────────
export function getLatestResult(
  studentId: string,
  results: ExamResult[]
): ExamResult | null {
  const studentResults = results
    .filter(r => r.student_id === studentId)
    .sort(
      (a, b) =>
        new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
    );
  return studentResults[0] ?? null;
}
