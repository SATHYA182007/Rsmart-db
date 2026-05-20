import { supabase } from './supabase';
import { Student, ExamResult } from '@/types';

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
    .from('exam_results')
    .select('*')
    .order('completed_at', { ascending: false });

  if (error) {
    console.error('[API] fetchExamResults error:', error.message);
    throw new Error(error.message);
  }
  return (data ?? []) as ExamResult[];
}

// ─── Helper ───────────────────────────────────────────────────────────────────
/** Returns the most recent exam result for a given student from a results list */
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
