import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Student, ExamResult } from '@/types';
import { formatCourse } from '@/types';
import StudentDrawer from './StudentDrawer';

interface StudentTableProps {
  students: Student[];
  examResults: ExamResult[];
  getLatestExamResult: (id: string) => ExamResult | null;
  loading: boolean;
  error: string | null;
}

const examStatusColors = {
  'Evaluated': 'bg-green-100 text-green-700',
  'Malpractice': 'bg-red-100 text-red-700',
};

export default function StudentTable({ students, examResults, getLatestExamResult, loading, error }: StudentTableProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    String(s.application_no).includes(search) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const displayed = filtered.slice(0, 8);
  const selectedExamResult = selectedStudent ? getLatestExamResult(selectedStudent.id) : null;

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-lg font-bold text-text-primary">Recent Applications</h3>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
            <Input
              className="pl-9 h-9"
              placeholder="Search students..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-3 h-9 bg-background border border-border rounded-md text-sm font-medium text-text-primary hover:bg-border transition-colors whitespace-nowrap">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background border-b border-border text-xs uppercase tracking-wider text-text-secondary">
              <th className="px-6 py-4 font-semibold">Student</th>
              <th className="px-6 py-4 font-semibold">Course</th>
              <th className="px-6 py-4 font-semibold">State</th>
              <th className="px-6 py-4 font-semibold">12th %</th>
              <th className="px-6 py-4 font-semibold">Exam Set</th>
              <th className="px-6 py-4 font-semibold">Exam Status</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading && (
              <tr>
                <td colSpan={7} className="text-center py-16">
                  <div className="flex items-center justify-center gap-3 text-text-secondary">
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Loading from Supabase...</span>
                  </div>
                </td>
              </tr>
            )}
            {error && !loading && (
              <tr>
                <td colSpan={7} className="text-center py-16 text-red-500 text-sm">{error}</td>
              </tr>
            )}
            {!loading && !error && displayed.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-16 text-text-secondary text-sm">No students found.</td>
              </tr>
            )}
            {!loading && !error && displayed.map((student) => {
              const result = getLatestExamResult(student.id);
              return (
                <tr
                  key={student.id}
                  className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                  onClick={() => { setSelectedStudent(student); setIsDrawerOpen(true); }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-text-primary group-hover:text-primary transition-colors">{student.name}</p>
                        <p className="text-xs text-text-secondary">#{student.application_no}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-primary">{formatCourse(student.course)}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{student.state}</td>
                  <td className="px-6 py-4 text-sm font-medium">{student.percentage_12th}%</td>
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
                  <td className="px-6 py-4 text-right">
                    <button className="text-text-secondary hover:text-primary transition-colors p-1 rounded-md hover:bg-background">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-border flex items-center justify-between bg-white mt-auto">
        <p className="text-sm text-text-secondary">
          Showing <span className="font-medium text-text-primary">{Math.min(displayed.length, students.length)}</span> of{' '}
          <span className="font-medium text-text-primary">{students.length}</span> students
        </p>
        <div className="flex items-center gap-2">
          <button className="p-1 rounded-md border border-border text-text-secondary hover:bg-background disabled:opacity-50" disabled>
            <ChevronLeft size={18} />
          </button>
          <button className="p-1 rounded-md border border-border text-text-secondary hover:bg-background disabled:opacity-50">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <StudentDrawer
        student={selectedStudent}
        examResult={selectedExamResult}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
