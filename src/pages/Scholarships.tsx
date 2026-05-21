import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList, RefreshCw, Search, ShieldAlert, CheckCircle2,
  Brain, Hash, Clock, TrendingUp, Award, Download
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppData } from '@/hooks/useAppData';
import { useCourse } from '@/context/CourseContext';
import { RANKING_BAND_STYLES, BAND_DISPLAY, RankingBand, getRankingBand, formatCourse } from '@/types';

export default function ExamResults() {
  const { config } = useCourse();
  const { students, examResults, loading, reload } = useAppData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Evaluated' | 'Malpractice'>('All');
  const [bandFilter, setBandFilter] = useState<string>('All');

  const enriched = useMemo(() => {
    return examResults
      .map(r => {
        const student = students.find(s => s.id === r.student_id);
        return {
          ...r,
          studentName: student?.name ?? 'Unknown',
          studentCourse: student?.course ?? '',
          studentAppNo: student?.application_no ?? '',
          studentState: student?.state ?? '',
        };
      })
      .filter(r => {
        const matchSearch =
          r.studentName.toLowerCase().includes(search.toLowerCase()) ||
          String(r.studentAppNo).includes(search) ||
          r.exam_set.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'All' || r.status === statusFilter;
        const band = r.band ?? getRankingBand(r.percentage);
        const matchBand = bandFilter === 'All' || band === bandFilter;
        return matchSearch && matchStatus && matchBand;
      });
  }, [examResults, students, search, statusFilter, bandFilter]);

  const total = examResults.length;
  const evaluated = examResults.filter(r => r.status === 'Evaluated').length;
  const malpractice = examResults.filter(r => r.status === 'Malpractice').length;
  const avgScore = total ? Math.round(examResults.reduce((s, r) => s + r.total_score, 0) / total) : 0;
  const avgPct = total ? (examResults.reduce((s, r) => s + r.percentage, 0) / total).toFixed(1) : '0';
  const distinguished = examResults.filter(r => (r.band ?? getRankingBand(r.percentage)) === 'DISTINGUISHED').length;

  const statsCards = [
    { label: 'Total Exams',      value: total,              color: 'text-blue-600',   bg: 'bg-blue-50',   icon: ClipboardList, action: () => { setStatusFilter('All'); setBandFilter('All'); } },
    { label: 'Evaluated',        value: evaluated,          color: 'text-green-600',  bg: 'bg-green-50',  icon: CheckCircle2, action: () => { setStatusFilter('Evaluated'); setBandFilter('All'); } },
    { label: 'Malpractice',      value: malpractice,        color: 'text-red-600',    bg: 'bg-red-50',    icon: ShieldAlert, action: () => { setStatusFilter('Malpractice'); setBandFilter('All'); } },
    { label: 'Avg Score',        value: `${avgScore}/100`,  color: 'text-indigo-600', bg: 'bg-indigo-50', icon: TrendingUp },
    { label: 'Avg Percentage',   value: `${avgPct}%`,       color: 'text-purple-600', bg: 'bg-purple-50', icon: Hash },
    { label: 'Distinguished',    value: distinguished,      color: 'text-amber-600',  bg: 'bg-amber-50',  icon: Award, action: () => { setStatusFilter('All'); setBandFilter('DISTINGUISHED'); } },
  ];

  const colSpanCount = 8 + config.sections.length;

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {statsCards.map((c, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -2 }} 
            onClick={c.action}
            className={`bg-card rounded-2xl ring-1 ring-foreground/10 p-4 shadow-soft ${c.action ? 'cursor-pointer hover:ring-primary/30' : ''}`}
          >
            <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center mb-2`}>
              <c.icon size={14} className={c.color} />
            </div>
            <p className={`text-xl font-extrabold ${c.color}`}>{loading ? '...' : c.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{c.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
              <Input className="pl-9 h-9 text-xs" placeholder="Search by name, app no, exam set..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['All', 'Evaluated', 'Malpractice'] as const).map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${statusFilter === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'}`}>
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {['All', 'DISTINGUISHED', 'PROFICIENT', 'ADVANCED', 'EMERGING'].map(b => (
                <button key={b} onClick={() => setBandFilter(b)}
                  className={`px-2.5 py-1.5 rounded-full text-xs font-semibold border transition ${bandFilter === b ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'}`}>
                  {b === 'All' ? 'All Bands' : BAND_DISPLAY[b as RankingBand]}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <div className="bg-card rounded-2xl ring-1 ring-foreground/10 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-background/95 backdrop-blur border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground sticky top-0 z-10">
              <th className="px-6 py-4">Applicant</th>
              <th className="px-6 py-4">Exam Set</th>
                {config.sections.map(sec => (
                  <th key={sec.key} className="px-6 py-4 text-center">{sec.label} ({sec.max})</th>
              ))}
              <th className="px-6 py-4 text-center">Total Score</th>
              <th className="px-6 py-4 text-center">Percentage</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Band</th>
              <th className="px-6 py-4">AI Insight</th>
              <th className="px-6 py-4">Completed On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-5"><div className="flex gap-3.5 items-center"><div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-16" /></div></div></td>
                      <td className="px-6 py-5"><Skeleton className="h-4 w-12" /></td>
                      {config.sections.map(sec => <td key={sec.key} className="px-6 py-5"><Skeleton className="h-4 w-10 mx-auto" /></td>)}
                      <td className="px-6 py-5"><Skeleton className="h-4 w-12 mx-auto" /></td>
                      <td className="px-6 py-5"><Skeleton className="h-4 w-12 mx-auto" /></td>
                      <td className="px-6 py-5"><Skeleton className="h-5 w-24 rounded-full mx-auto" /></td>
                      <td className="px-6 py-5"><Skeleton className="h-5 w-24 rounded" /></td>
                      <td className="px-6 py-5"><div className="flex gap-1.5 items-start"><Skeleton className="w-3 h-3 rounded-full mt-1 shrink-0" /><Skeleton className="h-8 w-32" /></div></td>
                      <td className="px-6 py-5"><Skeleton className="h-4 w-16" /></td>
                    </tr>
                  ))}
                </>
              ) : enriched.length === 0 ? (
                <tr><td colSpan={colSpanCount} className="text-center py-16 text-muted-foreground">No exam results found.</td></tr>
              ) : enriched.map(r => {
                const band: RankingBand = r.band ?? getRankingBand(r.percentage);
                return (
                  <tr key={r.id} className="hover:bg-muted/60 transition-colors group text-sm">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3.5">

                        <div className="min-w-0">
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">{r.studentName}</p>
                          <p className="text-xs text-muted-foreground">#{r.studentAppNo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-mono uppercase text-muted-foreground">{r.exam_set}</td>
                    {config.sections.map(sec => (
                      <td key={sec.key} className="px-6 py-5 text-center font-semibold text-foreground">
                        {Number(r[sec.key as keyof typeof r] ?? 0)}/{sec.max}
                      </td>
                    ))}
                    <td className="px-6 py-5 text-center font-bold text-foreground text-base">{r.total_score}/100</td>
                    <td className="px-6 py-5 text-center font-bold text-primary text-base">{(r.percentage || 0).toFixed(1)}%</td>
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border text-xs font-medium text-foreground`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${r.status === 'Malpractice' ? 'bg-red-500' : 'bg-green-500'}`} />
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-2.5 py-1 rounded text-xs font-semibold ${RANKING_BAND_STYLES[band]}`}>
                        {BAND_DISPLAY[band]}
                      </span>
                    </td>
                    <td className="px-6 py-5 max-w-[200px]">
                      {r.ai_feedback ? (
                        <div className="flex items-start gap-1">
                          <Brain size={11} className="text-primary shrink-0 mt-0.5" />
                          <p className="text-muted-foreground truncate" title={r.ai_feedback}>{r.ai_feedback}</p>
                        </div>
                      ) : <span className="text-muted-foreground italic">—</span>}
                    </td>
                    <td className="px-6 py-5 text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {new Date(r.completed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
