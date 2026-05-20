import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle2, RefreshCw, Star } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Student, ExamResult, RankingBand, AdmissionStatus, ReviewStatus } from '@/types';
import { formatCourse, RANKING_BAND_STYLES, ADMISSION_STATUS_STYLES } from '@/types';
import StudentDrawer from './StudentDrawer';

interface StudentTableProps {
  students: Student[];
  examResults: ExamResult[];
  getLatestExamResult: (id: string) => ExamResult | null;
  loading: boolean;
  error: string | null;
  onUpdateStudent: (id: string, updates: Partial<Student>) => Promise<void>;
}

export default function StudentTable({
  students,
  examResults,
  getLatestExamResult,
  loading,
  error,
  onUpdateStudent
}: StudentTableProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [courseFilter, setCourseFilter] = useState('All');
  const [bandFilter, setBandFilter] = useState('All');

  // Filter logic
  const filtered = students.filter(s => {
    const matchSearch =
      (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
      String(s.application_no || '').includes(search) ||
      (s.state || '').toLowerCase().includes(search.toLowerCase());

    const matchCourse = courseFilter === 'All' || s.course === courseFilter;
    const matchBand = bandFilter === 'All' || s.ranking_band === bandFilter;

    return matchSearch && matchCourse && matchBand;
  });

  const pageSize = 8;
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const displayed = filtered.slice((page - 1) * pageSize, page * pageSize);

  const selectedExamResult = selectedStudent ? getLatestExamResult(selectedStudent.id) : null;

  return (
    <div className="bg-white rounded-xl border border-border shadow-soft overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="p-5 border-b border-border flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
        <div>
          <h3 className="text-base font-bold text-text-primary">Recent Applications</h3>
          <p className="text-xs text-text-secondary mt-0.5">Track and manage student applications and exam performances</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={15} />
            <Input
              className="pl-9 h-9 text-xs"
              placeholder="Search by name, app no, state..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select
            value={courseFilter}
            onChange={e => { setCourseFilter(e.target.value); setPage(1); }}
            className="px-2.5 h-9 rounded-lg border border-border bg-white text-xs font-semibold text-text-primary focus:outline-none"
          >
            <option value="All">All Courses</option>
            <option value="engineering">Engineering</option>
            <option value="mba">MBA</option>
            <option value="arts_science">Arts & Science</option>
            <option value="bca">BCA</option>
            <option value="bcom">B.Com</option>
          </select>
          <select
            value={bandFilter}
            onChange={e => { setBandFilter(e.target.value); setPage(1); }}
            className="px-2.5 h-9 rounded-lg border border-border bg-white text-xs font-semibold text-text-primary focus:outline-none"
          >
            <option value="All">All Bands</option>
            <option value="Distinguished">Distinguished</option>
            <option value="Proficient">Proficient</option>
            <option value="Advanced">Advanced</option>
            <option value="Emerging">Emerging</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background border-b border-border text-[10px] font-bold uppercase tracking-wider text-text-secondary sticky top-0 z-10">
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Course</th>
              <th className="px-6 py-4">State</th>
              <th className="px-6 py-4">12th %</th>
              <th className="px-6 py-4">Exam Score</th>
              <th className="px-6 py-4">Ranking Band</th>
              <th className="px-6 py-4 text-center">Scholarship</th>
              <th className="px-6 py-4 text-center">Admission Status</th>
              <th className="px-6 py-4 text-center">Review</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading && (
              <tr>
                <td colSpan={10} className="text-center py-16">
                  <div className="flex items-center justify-center gap-3 text-text-secondary text-xs">
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Syncing with Supabase database...</span>
                  </div>
                </td>
              </tr>
            )}
            {error && !loading && (
              <tr>
                <td colSpan={10} className="text-center py-16 text-red-500 text-xs">{error}</td>
              </tr>
            )}
            {!loading && !error && displayed.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center py-16 text-text-secondary text-xs">No records found.</td>
              </tr>
            )}
            {!loading && !error && displayed.map((student) => {
              const result = getLatestExamResult(student.id);
              const rankBand: RankingBand = student.ranking_band || 'Emerging';
              const admStatus: AdmissionStatus = student.admission_status || 'Applied';
              const revStatus: ReviewStatus = student.review_status || 'Pending';

              return (
                <tr
                  key={student.id}
                  className="hover:bg-blue-50/20 transition-colors cursor-pointer group text-xs"
                  onClick={() => { setSelectedStudent(student); setIsDrawerOpen(true); }}
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {(student.name || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary group-hover:text-primary transition-colors">{student.name}</p>
                        <p className="text-[10px] text-text-secondary">App No: #{student.application_no}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-text-primary font-medium">{formatCourse(student.course)}</td>
                  <td className="px-6 py-3.5 text-text-secondary">{student.state}</td>
                  <td className="px-6 py-3.5 text-text-primary font-semibold">{student.percentage_12th}%</td>
                  <td className="px-6 py-3.5 font-mono text-text-primary font-semibold">
                    {result ? `${result.total_score || 0} (${(result.percentage || 0).toFixed(0)}%)` : '—'}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${RANKING_BAND_STYLES[rankBand]}`}>
                      {rankBand}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    {student.scholarship_eligible ? (
                      <span className="inline-flex items-center gap-0.5 text-success font-semibold">
                        <Star size={12} className="fill-success" /> Yes
                      </span>
                    ) : (
                      <span className="text-text-secondary">No</span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ADMISSION_STATUS_STYLES[admStatus] || 'bg-gray-100 text-gray-700'}`}>
                      {admStatus}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      revStatus === 'Reviewed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {revStatus}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                    <button className="text-text-secondary hover:text-primary transition-colors p-1 rounded hover:bg-background">
                      <MoreHorizontal size={16} />
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
        <p className="text-xs text-text-secondary font-medium">
          Showing <span className="text-text-primary">{Math.min(displayed.length, filtered.length)}</span> of{' '}
          <span className="text-text-primary">{filtered.length}</span> students
        </p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1 rounded border border-border text-text-secondary hover:bg-background disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-semibold text-text-primary px-2">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1 rounded border border-border text-text-secondary hover:bg-background disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <StudentDrawer
        student={selectedStudent}
        examResult={selectedExamResult}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdateStudent={onUpdateStudent}
      />
    </div>
  );
}
