import React from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { RefreshCw } from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';
import { formatCourse } from '@/types';

const COLORS = ['#3B82F6', '#7AB8FF', '#4F8CFF', '#93C5FD', '#BFDBFE'];

const StatCard = ({ label, value, sub }: { label: string; value: string; sub: string }) => (
  <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
    <p className="text-sm font-medium text-text-secondary mb-1">{label}</p>
    <p className="text-3xl font-bold text-text-primary">{value}</p>
    <p className="text-xs text-text-secondary mt-1">{sub}</p>
  </div>
);

export default function Analytics() {
  const { students, examResults, loading } = useAppData();

  const evaluated = examResults.filter(r => r.status === 'Evaluated');
  const malpractice = examResults.filter(r => r.status === 'Malpractice');

  const avgScore = evaluated.length
    ? (evaluated.reduce((a, b) => a + b.percentage, 0) / evaluated.length).toFixed(1)
    : '0';

  const avg12th = students.length
    ? (students.reduce((a, b) => a + b.percentage_12th, 0) / students.length).toFixed(1)
    : '0';

  const malpracticeRate = examResults.length
    ? ((malpractice.length / examResults.length) * 100).toFixed(1)
    : '0';

  const evalRate = examResults.length
    ? ((evaluated.length / examResults.length) * 100).toFixed(0)
    : '0';

  // Section averages
  const mkAvg = (key: keyof typeof examResults[0]) =>
    examResults.length
      ? (examResults.reduce((a, b) => a + (b[key] as number), 0) / examResults.length).toFixed(1)
      : '0';

  const examRadarData = [
    { section: 'Section A', score: Number(mkAvg('section_a_score')) },
    { section: 'Section B', score: Number(mkAvg('section_b_score')) },
    { section: 'Section C', score: Number(mkAvg('section_c_score')) },
    { section: 'Section D', score: Number(mkAvg('section_d_score')) },
  ];

  // Course distribution
  const courseCounts: Record<string, number> = {};
  students.forEach(s => {
    const label = formatCourse(s.course);
    courseCounts[label] = (courseCounts[label] ?? 0) + 1;
  });
  const courseData = Object.entries(courseCounts).map(([name, value], i) => ({
    name, value, color: COLORS[i % COLORS.length],
  }));

  // State distribution
  const stateCounts: Record<string, number> = {};
  students.forEach(s => {
    stateCounts[s.state] = (stateCounts[s.state] ?? 0) + 1;
  });
  const stateData = Object.entries(stateCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, students]) => ({ name, students }));

  // Monthly trend
  const monthlyData = [
    { name: 'Jan', apps: 2, evaluated: 1, malpractice: 0 },
    { name: 'Feb', apps: 4, evaluated: 2, malpractice: 1 },
    { name: 'Mar', apps: 6, evaluated: 4, malpractice: 1 },
    { name: 'Apr', apps: 8, evaluated: 5, malpractice: 2 },
    { name: 'May', apps: students.length, evaluated: evaluated.length, malpractice: malpractice.length },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-text-secondary">
        <RefreshCw size={22} className="animate-spin" />
        <span>Loading analytics from Supabase...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
        <p className="text-text-secondary mt-1">Deep dive into admission trends and exam performance.</p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <StatCard label="Avg Exam Score" value={`${avgScore}%`} sub={`${evaluated.length} evaluated results`} />
        <StatCard label="Evaluation Rate" value={`${evalRate}%`} sub={`${evaluated.length} of ${examResults.length} results`} />
        <StatCard label="Avg 12th %" value={`${avg12th}%`} sub="Across all applicants" />
        <StatCard label="Malpractice Rate" value={`${malpracticeRate}%`} sub={`${malpractice.length} flagged cases`} />
      </div>

      {/* Growth + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-border p-6 shadow-sm lg:col-span-2"
        >
          <h3 className="text-lg font-bold text-text-primary mb-6">Applications vs Exam Outcomes</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="gApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gEvaluated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EEF9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dx={-8} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }} />
                <Legend />
                <Area type="monotone" dataKey="apps" name="Applications" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#gApps)" />
                <Area type="monotone" dataKey="evaluated" name="Evaluated" stroke="#22C55E" strokeWidth={2.5} fillOpacity={1} fill="url(#gEvaluated)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-border p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-text-primary mb-6">Course Distribution</h3>
          {courseData.length === 0 ? (
            <p className="text-text-secondary text-sm text-center mt-16">No data</p>
          ) : (
            <>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={courseData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={3}>
                      {courseData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {courseData.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-text-secondary">{c.name}</span>
                    </div>
                    <span className="font-medium text-text-primary">{c.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* State + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-border p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-text-primary mb-6">State-wise Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EEF9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} dx={-4} />
                <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                <Bar dataKey="students" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={32} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-border p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-text-primary mb-6">Avg Exam Section Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={examRadarData}>
                <PolarGrid stroke="#E5EEF9" />
                <PolarAngleAxis dataKey="section" tick={{ fill: '#64748B', fontSize: 12 }} />
                <Radar name="Avg Score" dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-3">
            {examRadarData.map((d, i) => (
              <div key={i} className="text-center bg-background rounded-lg p-2">
                <p className="text-sm font-bold text-text-primary">{d.score}</p>
                <p className="text-xs text-text-secondary">{d.section.replace('Section ', 'Sec ')}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
