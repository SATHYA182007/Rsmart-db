import { supabase } from './supabase';
import { Student, ExamResult } from '@/types';

// ─── Students ─────────────────────────────────────────────────────────────────
export async function fetchStudents(tableName: string): Promise<Student[]> {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`[API] fetchStudents error on ${tableName}:`, error.message);
    throw new Error(error.message);
  }
  return (data ?? []) as Student[];
}

// ─── Exam Results ─────────────────────────────────────────────────────────────
export async function fetchExamResults(tableName: string): Promise<ExamResult[]> {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .order('completed_at', { ascending: false });

  if (error) {
    console.error(`[API] fetchExamResults error on ${tableName}:`, error.message);
    throw new Error(error.message);
  }
  return (data ?? []) as ExamResult[];
}

// ─── Update Student ───────────────────────────────────────────────────────────
export async function updateStudentData(
  tableName: string,
  studentId: string,
  updates: Partial<Student>
): Promise<void> {
  const { error } = await supabase
    .from(tableName)
    .update(updates)
    .eq('id', studentId);

  if (error) {
    console.error(`[API] updateStudentData error on ${tableName}:`, error.message);
    throw new Error(error.message);
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
