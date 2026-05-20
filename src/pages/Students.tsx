import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, MoreHorizontal, Plus, Download, AlertTriangle, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Student, ExamStatus } from '@/types';
import { formatCourse } from '@/types';
import StudentDrawer from '@/components/StudentDrawer';
import { useAppData } from '@/hooks/useAppData';

const examStatusColors: Record<ExamStatus, string> = {
  'Evaluated': 'bg-green-100 text-green-700 border border-green-200',
  'Malpractice': 'bg-red-100 text-red-700 border border-red-200',
};

type FilterStatus = ExamStatus | 'All' | 'No Result';
const ALL_STATUSES: FilterStatus[] = ['All', 'Evaluated', 'Malpractice', 'No Result'];
const PAGE_SIZE = 10;

export default function Students() {
  const { students, examResults, loading, error, getLatestExamResult, reload, updateStudent } = useAppData();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('All');
  const [page, setPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    return students.filter(s => {
      const matchSearch =
        (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
        String(s.application_no || '').includes(search) ||
        (s.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (s.exam_set || '').toLowerCase().includes(search.toLowerCase());

      const result = getLatestExamResult(s.id);
      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'No Result' && !result) ||
        (result && result.status === statusFilter);

      return matchSearch && matchStatus;
    });
  }, [students, examResults, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selectedExamResult = selectedStudent ? getLatestExamResult(selectedStudent.id) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Student Management</h1>
          <p className="text-text-secondary mt-1">
            {loading ? 'Loading...' : `${filtered.length} total applications found`}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={reload}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            Add Student
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          <AlertCircle size={18} />
          <span><strong>Supabase error:</strong> {error}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-border p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
          <Input
            className="pl-9"
            placeholder="Search by name, app no, email, exam set..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {ALL_STATUSES.map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                statusFilter === s
                  ? 'bg-primary text-white border-primary shadow-soft'
                  : 'bg-background text-text-secondary border-border hover:border-primary hover:text-primary'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="bg-white rounded-xl border border-border shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-background border-b border-border text-xs uppercase tracking-wider text-text-secondary">
                <th className="px-6 py-4 font-semibold">Student</th>
                <th className="px-6 py-4 font-semibold">Course</th>
                <th className="px-6 py-4 font-semibold">State</th>
                <th className="px-6 py-4 font-semibold">12th %</th>
                <th className="px-6 py-4 font-semibold">UG Status</th>
                <th className="px-6 py-4 font-semibold">Exam Set</th>
                <th className="px-6 py-4 font-semibold">Exam Status</th>
                <th className="px-6 py-4 font-semibold">Score</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && (
                <tr>
                  <td colSpan={9} className="text-center py-16">
                    <div className="flex items-center justify-center gap-3 text-text-secondary">
                      <RefreshCw size={20} className="animate-spin" />
                      <span>Loading students from Supabase...</span>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && paginated.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-text-secondary">
                    No students found matching your criteria.
                  </td>
                </tr>
              )}
              {!loading && paginated.map((student, i) => {
                const result = getLatestExamResult(student.id);
                return (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                    onClick={() => { setSelectedStudent(student); setDrawerOpen(true); }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {(student.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary group-hover:text-primary transition-colors">{student.name}</p>
                          <p className="text-xs text-text-secondary">#{student.application_no}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-primary">{formatCourse(student.course)}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{student.state}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text-primary text-sm">{student.percentage_12th}%</span>
                        <div className="w-12 bg-background rounded-full h-1.5">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.min(student.percentage_12th, 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{student.ug_status}</td>
                    <td className="px-6 py-4 text-sm font-mono text-text-secondary uppercase">{student.exam_set}</td>
                    <td className="px-6 py-4">
                      {result ? (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${examStatusColors[result.status]}`}>
                          {result.status === 'Malpractice' ? <AlertTriangle size={11} /> : <CheckCircle2 size={11} />}
                          {result.status}
                        </span>
                      ) : (
                        <span className="text-xs text-text-secondary italic">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-text-primary">
                      {result ? `${result.total_score || 0} (${(result.percentage || 0).toFixed(0)}%)` : '—'}
                    </td>
                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                      <button className="p-1 rounded-md text-text-secondary hover:text-primary hover:bg-background transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            Showing <span className="font-medium text-text-primary">{Math.min((page - 1) * PAGE_SIZE + 1, filtered.length || 0)}</span> to{' '}
            <span className="font-medium text-text-primary">{Math.min(page * PAGE_SIZE, filtered.length)}</span> of{' '}
            <span className="font-medium text-text-primary">{filtered.length}</span> results
          </p>
          <div className="flex items-center gap-1">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="p-1.5 rounded-md border border-border text-text-secondary hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed transition">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-md text-sm font-medium transition ${page === i + 1 ? 'bg-primary text-white' : 'border border-border text-text-secondary hover:bg-background'}`}>
                {i + 1}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
              className="p-1.5 rounded-md border border-border text-text-secondary hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed transition">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      <StudentDrawer student={selectedStudent} examResult={selectedExamResult} isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} onUpdateStudent={updateStudent} />
    </div>
  );
}
