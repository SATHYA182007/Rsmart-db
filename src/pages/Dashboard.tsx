import React from 'react';
import { motion } from 'framer-motion';
import {
  Users, CheckCircle2, AlertTriangle, TrendingUp,
  FileCheck, BadgeAlert, Sparkles, RefreshCw,
  CheckCircle, BarChart3
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';
import { useAppData } from '@/hooks/useAppData';
import { useCourse } from '@/context/CourseContext';
import { formatCourse, RANKING_BAND_STYLES, BAND_DISPLAY, getRankingBand, RankingBand } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const COLORS = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function Dashboard() {
  const { config } = useCourse();
  const { students, examResults, loading, error, reload } = useAppData();

  const totalStudents = students.length;
  const testsCompleted = examResults.length;
  const pendingTests = Math.max(0, totalStudents - testsCompleted);

  const evaluatedResults = examResults.filter(r => r.status === 'Evaluated');
  const passedStudents = evaluatedResults.filter(r => r.percentage >= 50).length;
  const passRate = evaluatedResults.length
    ? Math.round((passedStudents / evaluatedResults.length) * 100)
    : 0;
  const malpracticeCount = examResults.filter(r => r.status === 'Malpractice').length;

  const bandCounts: Record<RankingBand, number> = {
    DISTINGUISHED: 0, PROFICIENT: 0, ADVANCED: 0, EMERGING: 0,
  };
  examResults.forEach(r => {
    const b = r.band ?? getRankingBand(r.percentage);
    bandCounts[b] = (bandCounts[b] ?? 0) + 1;
  });
  const distinguishedCount = bandCounts.DISTINGUISHED;

  const sectionAvgs = config.sections.map(sec => {
    const total = examResults.reduce((sum, r) => sum + Number((r as any)[sec.key] ?? 0), 0);
    const avg = examResults.length ? Math.round(total / examResults.length) : 0;
    return { name: sec.label, score: avg, max: sec.max };
  });

  const avgScore = examResults.length
    ? Math.round(examResults.reduce((sum, r) => sum + r.total_score, 0) / examResults.length)
    : 0;

  const summaryCards = [
    { title: 'Total Applicants',   value: totalStudents,          trend: '+15.2%', icon: Users,        color: 'text-blue-600',   bg: 'bg-blue-50'   },
    { title: 'Tests Completed',    value: testsCompleted,         trend: '+10.4%', icon: FileCheck,    color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Pending Tests',      value: pendingTests,           trend: '-4.1%',  icon: BadgeAlert,   color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Pass Rate',          value: `${passRate}%`,         trend: '+2.8%',  icon: CheckCircle2, color: 'text-green-600',  bg: 'bg-green-50'  },
    { title: 'Distinguished Band', value: distinguishedCount,     trend: '+5.0%',  icon: TrendingUp,   color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Evaluated',          value: evaluatedResults.length,trend: '+12.0%', icon: CheckCircle,  color: 'text-teal-600',   bg: 'bg-teal-50'   },
    { title: 'Average Score',      value: `${avgScore}/100`,      trend: '+3.1%',  icon: BarChart3,    color: 'text-violet-600', bg: 'bg-violet-50' },
    { title: 'Malpractice Cases',  value: malpracticeCount,       trend: '-3.2%',  icon: AlertTriangle,color: 'text-red-600',    bg: 'bg-red-50'    },
  ];

  const bandData = (Object.entries(bandCounts) as [RankingBand, number][])
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ name: BAND_DISPLAY[k], value: v }));

  const performers = examResults
    .map(res => {
      const student = students.find(s => s.id === res.student_id);
      return {
        name: student?.name || 'Unknown',
        course: student?.course || '',
        score: res.total_score,
        percentage: res.percentage,
        band: res.band ?? getRankingBand(res.percentage),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <div className="space-y-6">

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-destructive text-xs font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(c => (
          <motion.div
            key={c.title}
            whileHover={{ y: -2 }}
            className="bg-card rounded-2xl ring-1 ring-foreground/10 p-5 flex flex-col justify-between shadow-soft min-h-[108px]"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-muted-foreground">{c.title}</span>
              <div className={`p-1.5 rounded-lg ${c.bg} shrink-0`}>
                <c.icon size={15} className={c.color} />
              </div>
            </div>
            <div className="flex justify-between items-baseline mt-4">
              <span className="text-2xl font-extrabold text-foreground">
                {loading ? '...' : c.value}
              </span>
              <span className="text-[10px] font-bold text-green-600">{c.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Row 2: Avg Section Scores | Top Performers | Band Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avg Section Scores */}
        <Card>
          <CardHeader className="border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 size={15} className="text-primary" />
              <CardTitle className="text-sm font-bold">Avg Section Scores</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {sectionAvgs.map(s => (
              <div key={s.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{s.name}</span>
                  <span className="font-bold text-foreground">{s.score}/{s.max}</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${s.max > 0 ? Math.min((s.score / s.max) * 100, 100) : 0}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="border-t border-border pt-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground font-semibold">Overall Avg Total</span>
                <span className="font-bold text-primary">{avgScore}/100</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-sm font-bold">Top Performers Leaderboard</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="divide-y divide-border">
              {performers.length === 0 ? (
                <p className="text-xs text-muted-foreground py-8 text-center">No evaluations completed yet.</p>
              ) : (
                performers.map((p, idx) => (
                  <div key={`${p.name}-${idx}`} className="flex items-center justify-between py-2.5 gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xs font-bold text-muted-foreground w-5 shrink-0">#{idx + 1}</span>
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground">{formatCourse(p.course)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${RANKING_BAND_STYLES[p.band]}`}>
                        {BAND_DISPLAY[p.band]}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-foreground whitespace-nowrap">
                        {p.score} ({(p.percentage || 0).toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance Band Distribution */}
        <Card>
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-sm font-bold">Performance Band Distribution</CardTitle>
            <p className="text-[10px] text-muted-foreground mt-0.5">Based on exam results</p>
          </CardHeader>
          <CardContent className="pt-4">
            {bandData.length === 0 ? (
              <div className="flex items-center justify-center text-xs text-muted-foreground min-h-[180px]">
                No exam data yet.
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={bandData} cx="50%" cy="50%" innerRadius={42} outerRadius={68} paddingAngle={3} dataKey="value">
                      {bandData.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full">
                  {bandData.map((d, idx) => (
                    <div key={d.name} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="text-[10px] font-semibold text-muted-foreground truncate">
                        {d.name} ({d.value})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Exam Status Monitor */}
      <Card>
        <CardHeader className="border-b border-border pb-3">
          <CardTitle className="text-sm font-bold">Exam Status Monitor</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: stat tiles */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-muted rounded-xl p-4">
                  <p className="text-2xl font-extrabold text-foreground">{testsCompleted}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 font-semibold uppercase tracking-wide">Completed</p>
                </div>
                <div className="bg-muted rounded-xl p-4">
                  <p className="text-2xl font-extrabold text-orange-500">{pendingTests}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 font-semibold uppercase tracking-wide">Pending</p>
                </div>
                <div className="bg-muted rounded-xl p-4">
                  <p className="text-2xl font-extrabold text-red-500">{malpracticeCount}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 font-semibold uppercase tracking-wide">Malpractice</p>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs bg-muted rounded-lg p-3">
                <span className="text-muted-foreground">
                  Pass Rate: <span className="font-bold text-green-600">{passRate}%</span>
                </span>
                <span className="text-muted-foreground">
                  Malpractice Rate:{' '}
                  <span className="font-bold text-red-500">
                    {((malpracticeCount / (testsCompleted || 1)) * 100).toFixed(1)}%
                  </span>
                </span>
              </div>
            </div>

            {/* Right: band summary bars */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Band Summary</p>
              {(Object.entries(bandCounts) as [RankingBand, number][]).map(([band, count]) => (
                <div key={band} className="flex items-center gap-3">
                  <span className={`w-28 shrink-0 text-center px-2 py-0.5 rounded text-[10px] font-semibold ${RANKING_BAND_STYLES[band]}`}>
                    {BAND_DISPLAY[band]}
                  </span>
                  <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${testsCompleted ? (count / testsCompleted) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-foreground w-5 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
