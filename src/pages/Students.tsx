import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search, ChevronLeft, ChevronRight, MoreHorizontal, Download,
  CheckCircle2, RefreshCw, AlertCircle, ShieldAlert
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Student, ExamStatus, RankingBand, RANKING_BAND_STYLES, BAND_DISPLAY, formatCourse } from '@/types';
import StudentDrawer from '@/components/StudentDrawer';
import { useAppData } from '@/hooks/useAppData';
import { useCourse } from '@/context/CourseContext';

const examStatusColors: Record<ExamStatus, string> = {
  'Evaluated': 'bg-green-100 text-green-700 border border-green-200',
  'Malpractice': 'bg-red-100 text-red-700 border border-red-200',
};

type FilterStatus = ExamStatus | 'All' | 'Pending';
const ALL_STATUSES: FilterStatus[] = ['All', 'Evaluated', 'Malpractice', 'Pending'];
const PAGE_SIZE = 10;

export default function Students() {
  const { config } = useCourse();
  const { students, examResults, loading, error, getLatestExamResult, reload, updateStudent } = useAppData();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('All');
  const [bandFilter, setBandFilter] = useState<string>('All');
  const [page, setPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    return students.filter(s => {
      const matchSearch =
        (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
        String(s.application_no || '').includes(search) ||
        (s.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (s.city || '').toLowerCase().includes(search.toLowerCase()) ||
        (s.exam_set || '').toLowerCase().includes(search.toLowerCase());

      const result = getLatestExamResult(s.id);
      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Pending' && !result) ||
        (result && result.status === statusFilter);

      const band = result?.band ?? 'EMERGING';
      const matchBand = bandFilter === 'All' || band === bandFilter;

      return matchSearch && matchStatus && matchBand;
    });
  }, [students, examResults, search, statusFilter, bandFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selectedExamResult = selectedStudent ? getLatestExamResult(selectedStudent.id) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="flex-row items-center justify-between border-b border-border pb-4 gap-4">
          <div>
            <CardTitle className="text-base font-bold text-foreground">{config.label} Applicant Management</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {loading ? 'Syncing...' : `${filtered.length} applicants • live from ${config.studentsTable}`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={reload}>
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => alert(`Exporting ${config.label} database to CSV...`)}>
              <Download size={13} />
              Export CSV
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-destructive text-sm">
          <AlertCircle size={17} />
          <span><strong>Database error:</strong> {error}</span>
        </div>
      )}

      {/* Filter Bar */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
              <Input
                className="pl-9"
                placeholder="Search by name, app no, email, exam set..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground font-semibold">Status:</span>
              {ALL_STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setPage(1); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    statusFilter === s
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-border hover:border-primary hover:text-primary'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground font-semibold">Band:</span>
              {['All', 'DISTINGUISHED', 'PROFICIENT', 'ADVANCED', 'EMERGING'].map(b => (
                <button
                  key={b}
                  onClick={() => { setBandFilter(b); setPage(1); }}
                  className={`px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    bandFilter === b
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-border hover:border-primary hover:text-primary'
                  }`}
                >
                  {b === 'All' ? 'All' : BAND_DISPLAY[b as RankingBand]}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="bg-card rounded-2xl ring-1 ring-foreground/10 shadow-soft overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left table-fixed">
            <colgroup>
              <col className="w-[190px]" />
              <col className="w-[130px]" />
              <col className="w-[130px]" />
              <col className="w-[70px]" />
              <col className="w-[100px]" />
              <col className="w-[80px]" />
              <col className="w-[100px]" />
              <col className="w-[110px]" />
              <col className="w-[100px]" />
              <col className="w-[60px]" />
            </colgroup>
            <thead>
              <tr className="bg-muted border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-3 py-4 font-semibold">Applicant</th>
                <th className="px-3 py-4 font-semibold">Branch/Course</th>
                <th className="px-3 py-4 font-semibold">Location</th>
                <th className="px-3 py-4 font-semibold">12th %</th>
                <th className="px-3 py-4 font-semibold">UG Status</th>
                <th className="px-3 py-4 font-semibold">Exam Set</th>
                <th className="px-3 py-4 font-semibold">Score</th>
                <th className="px-3 py-4 font-semibold">Exam Status</th>
                <th className="px-3 py-4 font-semibold">Band</th>
                <th className="px-3 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && (
                <tr>
                  <td colSpan={10} className="text-center py-16">
                    <div className="flex items-center justify-center gap-3 text-muted-foreground">
                      <RefreshCw size={19} className="animate-spin" />
                      <span className="text-sm">Loading applicants from {config.studentsTable}...</span>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && paginated.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-16 text-muted-foreground text-sm">
                    No applicants found matching your criteria.
                  </td>
                </tr>
              )}
              {!loading && paginated.map((student, i) => {
                const result = getLatestExamResult(student.id);
                const band: RankingBand = result?.band ?? 'EMERGING';
                return (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => { setSelectedStudent(student); setDrawerOpen(true); }}
                  >
                    <td className="px-3 py-4 truncate">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {(student.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">{student.name}</p>
                          <p className="text-xs text-muted-foreground">#{student.application_no} • {student.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-foreground font-medium truncate">{formatCourse(student.course)}</td>
                    <td className="px-3 py-4 text-sm text-muted-foreground truncate">{student.city}, {student.state}</td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">{student.percentage_12th}%</span>
                        <div className="hidden sm:block w-8 bg-muted rounded-full h-1.5 shrink-0">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.min(student.percentage_12th, 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-muted-foreground truncate">{student.ug_status ?? '—'}</td>
                    <td className="px-3 py-4 text-sm font-mono text-muted-foreground uppercase truncate">{student.exam_set}</td>
                    <td className="px-3 py-4 text-sm font-semibold text-foreground truncate">
                      {result ? `${result.total_score}/100 (${(result.percentage || 0).toFixed(0)}%)` : '—'}
                    </td>
                    <td className="px-3 py-4 truncate">
                      {result ? (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${examStatusColors[result.status]}`}>
                          {result.status === 'Malpractice' ? <ShieldAlert size={11} /> : <CheckCircle2 size={11} />}
                          <span className="truncate">{result.status}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Pending</span>
                      )}
                    </td>
                    <td className="px-3 py-4 truncate">
                      {result ? (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${RANKING_BAND_STYLES[band]}`}>
                          {BAND_DISPLAY[band]}
                        </span>
                      ) : <span className="text-muted-foreground text-xs">—</span>}
                    </td>
                    <td className="px-3 py-4 text-right" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-primary">
                        <MoreHorizontal size={17} />
                      </Button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{' '}
            <span className="font-medium text-foreground">{Math.min((page - 1) * PAGE_SIZE + 1, filtered.length || 0)}</span>–
            <span className="font-medium text-foreground">{Math.min(page * PAGE_SIZE, filtered.length)}</span> of{' '}
            <span className="font-medium text-foreground">{filtered.length}</span>
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft size={15} />
            </Button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-md text-sm font-medium transition ${page === i + 1 ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:bg-muted'}`}>
                {i + 1}
              </button>
            ))}
            <Button variant="outline" size="icon-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              <ChevronRight size={15} />
            </Button>
          </div>
        </div>
      </motion.div>

      <StudentDrawer student={selectedStudent} examResult={selectedExamResult} isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} onUpdateStudent={updateStudent} />
    </div>
  );
}
