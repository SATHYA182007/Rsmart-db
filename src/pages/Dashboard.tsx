import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileCheck, AlertTriangle, CheckCircle2, TrendingUp, GraduationCap, RefreshCw, AlertCircle } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import StudentTable from '@/components/StudentTable';
import { useAppData } from '@/hooks/useAppData';
import { formatCourse } from '@/types';

const growthData = [
  { name: 'Jan', apps: 20 },
  { name: 'Feb', apps: 80 },
  { name: 'Mar', apps: 220 },
  { name: 'Apr', apps: 480 },
  { name: 'May', apps: 860 },
];

export default function Dashboard() {
  const { students, examResults, loading, error, getLatestExamResult, reload } = useAppData();

  const total = students.length;
  const evaluated = examResults.filter(r => r.status === 'Evaluated').length;
  const malpractice = examResults.filter(r => r.status === 'Malpractice').length;
  const avgScore = examResults.length
    ? Math.round(examResults.reduce((a, b) => a + b.percentage, 0) / examResults.length)
    : 0;
  const graduated = students.filter(s => s.ug_status === 'Graduated').length;

  const analyticsData = [
    { title: 'Total Students', value: loading ? '...' : String(total), trend: '+12.5%', icon: Users, color: 'text-primary', bg: 'bg-blue-50' },
    { title: 'Evaluated', value: loading ? '...' : String(evaluated), trend: '+8.2%', icon: CheckCircle2, color: 'text-success', bg: 'bg-green-50' },
    { title: 'Malpractice', value: loading ? '...' : String(malpractice), trend: '-2.1%', icon: AlertTriangle, color: 'text-danger', bg: 'bg-red-50' },
    { title: 'Avg Exam Score', value: loading ? '...' : `${avgScore}%`, trend: '+4.1%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Exam Results', value: loading ? '...' : String(examResults.length), trend: '+10.1%', icon: FileCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'UG Graduated', value: loading ? '...' : String(graduated), trend: '+3.2%', icon: GraduationCap, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  // Course distribution from live data
  const courseCounts: Record<string, number> = {};
  students.forEach(s => {
    const label = formatCourse(s.course);
    courseCounts[label] = (courseCounts[label] ?? 0) + 1;
  });
  const courseData = Object.entries(courseCounts).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard Overview</h1>
          <p className="text-text-secondary mt-1">Welcome back! Here's what's happening with admissions today.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={reload}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg text-sm font-medium hover:bg-background transition-colors"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-gradientEnd shadow-soft transition-colors">
            Generate AI Summary
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          <AlertCircle size={18} />
          <span><strong>Supabase error:</strong> {error} — Check that the table names are <code className="font-mono bg-red-100 px-1 rounded">students</code> and <code className="font-mono bg-red-100 px-1 rounded">exam_results</code>.</span>
        </div>
      )}

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {analyticsData.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="bg-white p-5 rounded-xl border border-border shadow-sm hover:shadow-soft transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={stat.color} size={20} />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-text-primary mb-1">{stat.value}</h3>
            <p className="text-sm text-text-secondary font-medium">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-xl border border-border shadow-sm lg:col-span-2"
        >
          <h3 className="text-lg font-bold text-text-primary mb-6">Applications Growth</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EEF9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dx={-10} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px -10px rgba(59,130,246,0.15)' }} />
                <Area type="monotone" dataKey="apps" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}
          className="bg-white p-6 rounded-xl border border-border shadow-sm"
        >
          <h3 className="text-lg font-bold text-text-primary mb-6">Course Distribution</h3>
          {loading ? (
            <div className="h-72 flex items-center justify-center text-text-secondary">
              <RefreshCw size={24} className="animate-spin" />
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseData} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5EEF9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#F4F9FF' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={24} name="Students" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>

      {/* Student Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <StudentTable
          students={students}
          examResults={examResults}
          getLatestExamResult={getLatestExamResult}
          loading={loading}
          error={error}
        />
      </motion.div>
    </div>
  );
}
