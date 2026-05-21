import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, MoreHorizontal, RefreshCw, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Student, ExamResult, RankingBand, RANKING_BAND_STYLES, BAND_DISPLAY } from '@/types';
import { formatCourse } from '@/types';
import { useCourse } from '@/context/CourseContext';
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
  const { config } = useCourse();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [subCourseFilter, setSubCourseFilter] = useState('All');
  const [bandFilter, setBandFilter] = useState('All');

  // Dynamically extract unique course values present in this table
  const uniqueCourses = ['All', ...Array.from(new Set(students.map(s => s.course).filter(Boolean)))];

  const filtered = students.filter(s => {
    const matchSearch =
      (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
      String(s.application_no || '').includes(search) ||
      (s.state || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.email || '').toLowerCase().includes(search.toLowerCase());

    const matchCourse = subCourseFilter === 'All' || s.course === subCourseFilter;

    const result = getLatestExamResult(s.id);
    const bandVal = result?.band ?? 'EMERGING';
    const matchBand = bandFilter === 'All' || bandVal === bandFilter;

    return matchSearch && matchCourse && matchBand;
  });

  const pageSize = 8;
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const displayed = filtered.slice((page - 1) * pageSize, page * pageSize);
  const selectedExamResult = selectedStudent ? getLatestExamResult(selectedStudent.id) : null;

  return (
    <div className="bg-card rounded-2xl ring-1 ring-foreground/10 shadow-soft overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="p-5 border-b border-border flex flex-col md:flex-row justify-between items-center gap-4 bg-card">
        <div>
          <h3 className="text-base font-bold text-foreground">{config.label} Applicants Registry</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Live data from <span className="font-mono text-primary">{config.studentsTable}</span> table</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={15} />
            <Input
              className="pl-9 h-9 text-xs"
              placeholder="Search by name, app no, email..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select
            value={subCourseFilter}
            onChange={e => { setSubCourseFilter(e.target.value); setPage(1); }}
            className="px-2.5 h-9 rounded-lg border border-input bg-background text-xs font-semibold text-foreground focus:outline-none"
          >
            {uniqueCourses.map(c => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Branch/Courses' : formatCourse(c)}
              </option>
            ))}
          </select>
          <select
            value={bandFilter}
            onChange={e => { setBandFilter(e.target.value); setPage(1); }}
            className="px-2.5 h-9 rounded-lg border border-input bg-background text-xs font-semibold text-foreground focus:outline-none"
          >
            <option value="All">All Bands</option>
            <option value="DISTINGUISHED">Distinguished</option>
            <option value="PROFICIENT">Proficient</option>
            <option value="ADVANCED">Advanced</option>
            <option value="EMERGING">Emerging</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed">
          <colgroup>
            <col className="w-[180px]" />  {/* Applicant */}
            <col className="w-[140px]" />  {/* Branch/Course */}
            <col className="w-[140px]" />  {/* Location */}
            <col className="w-[70px]" />   {/* 12th % */}
            <col className="w-[100px]" />  {/* UG Status */}
            <col className="w-[90px]" />   {/* Exam Set */}
            <col className="w-[100px]" />  {/* Score */}
            <col className="w-[110px]" />  {/* Status */}
            <col className="w-[100px]" />  {/* Band */}
            <col className="w-[60px]" />   {/* Action */}
          </colgroup>
          <thead>
            <tr className="bg-background/95 backdrop-blur border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground sticky top-0 z-10">
              <th className="px-4 py-4">Applicant</th>
              <th className="px-4 py-4">Branch/Course</th>
              <th className="px-4 py-4">Location</th>
              <th className="px-4 py-4">12th %</th>
              <th className="px-4 py-4">UG Status</th>
              <th className="px-4 py-4">Exam Set</th>
              <th className="px-4 py-4">Score</th>
              <th className="px-4 py-4">Exam Status</th>
              <th className="px-4 py-4">Band</th>
              <th className="px-4 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading && (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-5"><div className="flex gap-3.5 items-center"><div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-16" /></div></div></td>
                    <td className="px-4 py-5"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-4 py-5"><div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-3 w-12" /></div></td>
                    <td className="px-4 py-5"><Skeleton className="h-4 w-12" /></td>
                    <td className="px-4 py-5"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-4 py-5"><Skeleton className="h-4 w-14" /></td>
                    <td className="px-4 py-5"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-4 py-5"><Skeleton className="h-5 w-20 rounded-full" /></td>
                    <td className="px-4 py-5"><Skeleton className="h-5 w-20 rounded" /></td>
                    <td className="px-4 py-5 text-right"><Skeleton className="h-6 w-6 rounded-lg ml-auto" /></td>
                  </tr>
                ))}
              </>
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
              const band: RankingBand = result?.band ?? 'EMERGING';

              return (
                <tr
                  key={student.id}
                  className="hover:bg-muted/60 transition-colors cursor-pointer group text-sm"
                  onClick={() => { setSelectedStudent(student); setIsDrawerOpen(true); }}
                >
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-3.5">

                      <div className="min-w-0">
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">{student.name}</p>
                        <p className="text-xs text-muted-foreground">#{student.application_no}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-foreground font-medium truncate">{formatCourse(student.course)}</td>
                  <td className="px-4 py-5 text-muted-foreground text-xs leading-snug">{student.city},<br />{student.state}</td>
                  <td className="px-4 py-5 text-foreground font-semibold">{student.percentage_12th}%</td>
                  <td className="px-4 py-5 text-muted-foreground">{student.ug_status ?? '—'}</td>
                  <td className="px-4 py-5 font-mono text-muted-foreground uppercase">{student.exam_set}</td>
                  <td className="px-4 py-5 font-mono text-foreground font-semibold text-xs">
                    {result ? `${result.total_score}/100 (${(result.percentage || 0).toFixed(0)}%)` : '—'}
                  </td>
                  <td className="px-4 py-5">
                    {result ? (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border text-xs font-medium text-foreground`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${result.status === 'Malpractice' ? 'bg-red-500' : 'bg-green-500'}`} />
                        {result.status}
                      </span>
                    ) : (
                      <span className="text-text-secondary italic text-[10px]">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-5">
                    {result && band ? (
                      <span className={`px-2.5 py-1 rounded text-xs font-semibold ${RANKING_BAND_STYLES[band]}`}>
                        {BAND_DISPLAY[band]}
                      </span>
                    ) : (
                       <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-5 text-right" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => { setSelectedStudent(student); setIsDrawerOpen(true); }}
                      className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-muted"
                    >
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
      <div className="p-4 border-t border-border flex items-center justify-between bg-card mt-auto">
        <p className="text-xs text-muted-foreground font-medium">
          Showing <span className="text-foreground">{displayed.length}</span> of{' '}
          <span className="text-foreground">{filtered.length}</span> applicants
        </p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1 rounded border border-border text-muted-foreground hover:bg-muted disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-semibold text-foreground px-2">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1 rounded border border-border text-muted-foreground hover:bg-muted disabled:opacity-50"
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
