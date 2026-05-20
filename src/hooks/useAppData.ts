import { useState, useEffect } from 'react';
import { Student, ExamResult } from '@/types';
import { fetchStudents, fetchExamResults, getLatestResult } from '@/lib/api';

interface AppData {
  students: Student[];
  examResults: ExamResult[];
  loading: boolean;
  error: string | null;
  getLatestExamResult: (studentId: string) => ExamResult | null;
  reload: () => void;
}

export function useAppData(): AppData {
  const [students, setStudents] = useState<Student[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([fetchStudents(), fetchExamResults()])
      .then(([s, e]) => {
        if (!cancelled) {
          setStudents(s);
          setExamResults(e);
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

  return {
    students,
    examResults,
    loading,
    error,
    getLatestExamResult: (id) => getLatestResult(id, examResults),
    reload: () => setTick(t => t + 1),
  };
}
