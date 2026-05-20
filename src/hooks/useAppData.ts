import { useState, useEffect } from 'react';
import { Student, ExamResult, Interview, Scholarship } from '@/types';
import {
  fetchStudents,
  fetchExamResults,
  fetchInterviews,
  fetchScholarships,
  getLatestResult,
  updateStudentStatus as apiUpdateStudentStatus,
  upsertInterview as apiUpsertInterview,
  updateScholarshipStatus as apiUpdateScholarshipStatus
} from '@/lib/api';

interface AppData {
  students: Student[];
  examResults: ExamResult[];
  interviews: Interview[];
  scholarships: Scholarship[];
  loading: boolean;
  error: string | null;
  getLatestExamResult: (studentId: string) => ExamResult | null;
  reload: () => void;
  updateStudent: (studentId: string, updates: Partial<Student>) => Promise<void>;
  saveInterview: (interview: Partial<Interview>) => Promise<void>;
  saveScholarshipStatus: (id: string, status: string, amount?: number) => Promise<void>;
}

export function useAppData(): AppData {
  const [students, setStudents] = useState<Student[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      fetchStudents(),
      fetchExamResults(),
      fetchInterviews().catch(() => []),
      fetchScholarships().catch(() => [])
    ])
      .then(([s, e, i, sch]) => {
        if (!cancelled) {
          setStudents(s);
          setExamResults(e);
          setInterviews(i);
          setScholarships(sch);
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message ?? 'Failed to load data');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [tick]);

  const reload = () => setTick(t => t + 1);

  const updateStudent = async (studentId: string, updates: Partial<Student>) => {
    await apiUpdateStudentStatus(studentId, updates);
    reload();
  };

  const saveInterview = async (interview: Partial<Interview>) => {
    await apiUpsertInterview(interview);
    reload();
  };

  const saveScholarshipStatus = async (id: string, status: string, amount?: number) => {
    await apiUpdateScholarshipStatus(id, status, amount);
    reload();
  };

  return {
    students,
    examResults,
    interviews,
    scholarships,
    loading,
    error,
    getLatestExamResult: (id) => getLatestResult(id, examResults),
    reload,
    updateStudent,
    saveInterview,
    saveScholarshipStatus,
  };
}
