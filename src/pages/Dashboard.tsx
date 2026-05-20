import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, CheckCircle2, AlertTriangle, TrendingUp, Award,
  FileCheck, ShieldAlert, BadgeAlert, Sparkles, RefreshCw, Calendar, ArrowRight,
  TrendingDown, CheckCircle, GraduationCap, DollarSign, Briefcase, Plus, Search
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import StudentTable from '@/components/StudentTable';
import { useAppData } from '@/hooks/useAppData';
import { formatCourse, RANKING_BAND_STYLES, getRankingBand } from '@/types';

const COLORS = ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'];

// Executive summary alert notifications
const alertNotifications = [
  { id: 1, text: 'Malpractice Flagged: Applicant uygug n njh identified with Section A anomalies.', type: 'danger' },
  { id: 2, text: 'Scholarship Pending: 3 applicants qualify for Distinguished merit funding.', type: 'warning' },
  { id: 3, text: 'Interview Completed: Ram Kannan has positive feedback from Reviewer.', type: 'success' },
];

export default function Dashboard() {
  const { students, examResults, interviews, scholarships, loading, error, getLatestExamResult, reload, updateStudent } = useAppData();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  // ─── Metrics Calculation ───────────────────────────────────────────────────
  const totalStudents = students.length;
  const testsCompleted = examResults.length;
  const pendingTests = totalStudents - testsCompleted;
  
  const passedStudents = examResults.filter(r => r.percentage >= 50 && r.status === 'Evaluated').length;
  const passRate = testsCompleted ? Math.round((passedStudents / testsCompleted) * 100) : 0;

  const approvedStudents = students.filter(s => s.admission_status === 'Approved' || s.admission_status === 'Enrolled').length;
  const conversionRate = totalStudents ? Math.round((approvedStudents / totalStudents) * 100) : 0;

  const scholarshipEligible = students.filter(s => s.scholarship_eligible).length;
  const malpracticeCount = examResults.filter(r => r.status === 'Malpractice').length;

  const summaryCards = [
    { title: 'Total Applicants', value: totalStudents, trend: '+15.2%', isPositive: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Tests Completed', value: testsCompleted, trend: '+10.4%', isPositive: true, icon: FileCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Pending Tests', value: pendingTests, trend: '-4.1%', isPositive: true, icon: BadgeAlert, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Pass Rate', value: `${passRate}%`, trend: '+2.8%', isPositive: true, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Conversion Rate', value: `${conversionRate}%`, trend: '+8.1%', isPositive: true, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Approved Students', value: approvedStudents, trend: '+12.0%', isPositive: true, icon: CheckCircle, color: 'text-teal-600', bg: 'bg-teal-50' },
    { title: 'Scholarship Eligible', value: scholarshipEligible, trend: '+4.5%', isPositive: true, icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Malpractice Cases', value: malpracticeCount, trend: '-3.2%', isPositive: true, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  // ─── Demographics & Funnel calculations ────────────────────────────────────
  const submittedCount = totalStudents;
  const shortlistedCount = students.filter(s => s.admission_status && s.admission_status !== 'Applied').length;
  const interviewedCount = students.filter(s => s.admission_status && ['Interviewed', 'Approved', 'Enrolled'].includes(s.admission_status)).length;
  const enrolledCount = students.filter(s => s.admission_status === 'Enrolled').length;

  const funnelStages = [
    { name: 'Submitted', count: submittedCount, percentage: 100 },
    { name: 'Tests Done', count: testsCompleted, percentage: submittedCount ? Math.round((testsCompleted / submittedCount) * 100) : 0 },
    { name: 'Shortlisted', count: shortlistedCount, percentage: submittedCount ? Math.round((shortlistedCount / submittedCount) * 100) : 0 },
    { name: 'Interviewed', count: interviewedCount, percentage: submittedCount ? Math.round((interviewedCount / submittedCount) * 100) : 0 },
    { name: 'Approved', count: approvedStudents, percentage: submittedCount ? Math.round((approvedStudents / submittedCount) * 100) : 0 },
    { name: 'Enrolled', count: enrolledCount, percentage: submittedCount ? Math.round((enrolledCount / submittedCount) * 100) : 0 },
  ];

  // ─── Score Distribution categories ─────────────────────────────────────────
  const distCounts = { Excellent: 0, Good: 0, Average: 0, BelowAverage: 0 };
  examResults.forEach(r => {
    if (r.percentage >= 76) distCounts.Excellent++;
    else if (r.percentage >= 51) distCounts.Good++;
    else if (r.percentage >= 26) distCounts.Average++;
    else distCounts.BelowAverage++;
  });
  const distData = [
    { name: 'Distinguished (76-100%)', value: distCounts.Excellent },
    { name: 'Proficient (51-75%)', value: distCounts.Good },
    { name: 'Advanced (26-50%)', value: distCounts.Average },
    { name: 'Emerging (0-25%)', value: distCounts.BelowAverage },
  ].filter(d => d.value > 0);

  // ─── Top Performers ────────────────────────────────────────────────────────
  const performers = examResults
    .map(res => {
      const student = students.find(s => s.id === res.student_id);
      return {
        name: student?.name || 'Unknown Student',
        course: student?.course || 'mba',
        score: res.total_score,
        percentage: res.percentage,
        band: getRankingBand(res.percentage),
        eligible: student?.scholarship_eligible ? 'Yes' : 'No',
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  // ─── Trend Charts ──────────────────────────────────────────────────────────
  const trendData = {
    daily: [
      { name: 'Mon', apps: 2, completed: 1 },
      { name: 'Tue', apps: 4, completed: 3 },
      { name: 'Wed', apps: 7, completed: 5 },
      { name: 'Thu', apps: 9, completed: 8 },
      { name: 'Fri', apps: totalStudents, completed: testsCompleted },
    ],
    weekly: [
      { name: 'Wk 1', apps: 3, completed: 2 },
      { name: 'Wk 2', apps: 6, completed: 4 },
      { name: 'Wk 3', apps: 9, completed: 7 },
      { name: 'Wk 4', apps: totalStudents, completed: testsCompleted },
    ],
    monthly: [
      { name: 'Jan', apps: 1, completed: 1 },
      { name: 'Feb', apps: 3, completed: 2 },
      { name: 'Mar', apps: 6, completed: 4 },
      { name: 'Apr', apps: 8, completed: 7 },
      { name: 'May', apps: totalStudents, completed: testsCompleted },
    ],
  }[timeframe];

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-border rounded-xl p-6 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary" size={20} />
            <h1 className="text-xl font-bold text-text-primary">Executive Admission Intelligence</h1>
          </div>
          <p className="text-xs text-text-secondary mt-1">Real-time metrics, student progress pipelines, and academic alerts.</p>
        </div>
        <div className="flex gap-2.5 w-full md:w-auto">
          <button
            onClick={reload}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg text-xs font-semibold hover:bg-background transition"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Sync Supabase
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-blue-600 transition shadow-soft">
            Executive Summary Report
          </button>
        </div>
      </div>

      {/* Executive Summary Management Insights Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-blue-700">Monthly Applications Trend</p>
            <p className="text-xs text-text-secondary mt-0.5">High volumes recorded in current cycle</p>
          </div>
          <span className="text-sm font-bold text-blue-700">+15% apps</span>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-green-700">Admission Conversion Rate</p>
            <p className="text-xs text-text-secondary mt-0.5">Conversion rate optimized from past cycles</p>
          </div>
          <span className="text-sm font-bold text-green-700">+8% conversion</span>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-red-700">Flagged Malpractice Cases</p>
            <p className="text-xs text-text-secondary mt-0.5">Secured evaluation protocol monitoring active</p>
          </div>
          <span className="text-sm font-bold text-red-700">-3% cases</span>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((c, i) => (
          <motion.div
            key={c.title}
            whileHover={{ y: -3 }}
            className="bg-white rounded-xl border border-border p-5 flex flex-col justify-between shadow-soft min-h-[110px]"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-text-secondary">{c.title}</span>
              <div className={`p-1.5 rounded-lg ${c.bg} shrink-0`}>
                <c.icon size={16} className={c.color} />
              </div>
            </div>
            <div className="flex justify-between items-baseline mt-4">
              <span className="text-2xl font-extrabold text-text-primary">{loading ? '...' : c.value}</span>
              <span className="text-[10px] font-bold text-green-600">{c.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics & Funnel Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications Trend Card */}
        <div className="bg-white rounded-xl border border-border p-6 shadow-soft lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Applications Flow</h3>
              <p className="text-[10px] text-text-secondary">Submitted vs completed exam trends</p>
            </div>
            <div className="flex gap-1.5 bg-background p-1 rounded-lg">
              {(['daily', 'weekly', 'monthly'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md capitalize transition ${timeframe === t ? 'bg-white text-primary shadow-soft' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818CF8" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#818CF8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EEF9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} dx={-8} />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', fontSize: 11 }} />
                <Area type="monotone" dataKey="apps" name="Applications" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" />
                <Area type="monotone" dataKey="completed" name="Exams Finished" stroke="#818CF8" strokeWidth={2} fillOpacity={1} fill="url(#colorComp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funnel Stage Card */}
        <div className="bg-white rounded-xl border border-border p-6 shadow-soft space-y-4">
          <div>
            <h3 className="text-sm font-bold text-text-primary">Admission Funnel Pipeline</h3>
            <p className="text-[10px] text-text-secondary">Conversion rate at each recruitment step</p>
          </div>
          <div className="space-y-3.5">
            {funnelStages.map((stage, i) => (
              <div key={stage.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-text-primary">
                  <span>{stage.name}</span>
                  <span className="text-text-secondary">{stage.count} ({stage.percentage}%)</span>
                </div>
                <div className="w-full bg-background h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${stage.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Score & Leaders Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score distribution */}
        <div className="bg-white rounded-xl border border-border p-6 shadow-soft space-y-4">
          <div>
            <h3 className="text-sm font-bold text-text-primary">Exam Score Bands</h3>
            <p className="text-[10px] text-text-secondary">Rank breakdown of evaluated tests</p>
          </div>
          {distData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-xs text-text-secondary">No exam records.</div>
          ) : (
            <div className="h-56 flex flex-col justify-between">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={distData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="value">
                    {distData.map((e, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-text-secondary">
                {distData.map((d, idx) => (
                  <div key={d.name} className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="truncate">{d.name} ({d.value})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Top Performers Leaderboard */}
        <div className="bg-white rounded-xl border border-border p-6 shadow-soft lg:col-span-2 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-text-primary">Top Performers</h3>
            <p className="text-[10px] text-text-secondary">Applicants with highest exam percentile</p>
          </div>
          <div className="divide-y divide-border">
            {performers.length === 0 ? (
              <p className="text-xs text-text-secondary py-4 text-center">No evaluations completed yet.</p>
            ) : (
              performers.map((p, idx) => (
                <div key={`${p.name}-${idx}`} className="flex items-center justify-between py-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-text-secondary w-4">#{idx + 1}</span>
                    <div>
                      <p className="font-bold text-text-primary">{p.name}</p>
                      <p className="text-[10px] text-text-secondary capitalize">{formatCourse(p.course)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${RANKING_BAND_STYLES[p.band]}`}>{p.band}</span>
                    <span className="font-mono font-bold text-text-primary">{p.score} ({(p.percentage || 0).toFixed(0)}%)</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Dashboard Alerts widget & Test Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alerts & Notifications Widget */}
        <div className="bg-white rounded-xl border border-border p-6 shadow-soft space-y-4">
          <h3 className="text-sm font-bold text-text-primary">Important Admission Alerts</h3>
          <div className="space-y-3">
            {alertNotifications.map(n => (
              <div key={n.id} className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs leading-relaxed ${
                n.type === 'danger' ? 'bg-red-50 border-red-100 text-red-700' :
                n.type === 'warning' ? 'bg-yellow-50 border-yellow-100 text-yellow-700' :
                'bg-green-50 border-green-100 text-green-700'
              }`}>
                {n.type === 'danger' && <ShieldAlert size={14} className="shrink-0 mt-0.5" />}
                {n.type === 'warning' && <AlertTriangle size={14} className="shrink-0 mt-0.5" />}
                {n.type === 'success' && <CheckCircle2 size={14} className="shrink-0 mt-0.5" />}
                <span>{n.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Exam monitoring status */}
        <div className="bg-white rounded-xl border border-border p-6 shadow-soft space-y-4">
          <h3 className="text-sm font-bold text-text-primary">Test Progress Monitor</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-background rounded-lg p-3">
              <p className="text-lg font-bold text-text-primary">{testsCompleted}</p>
              <p className="text-[10px] text-text-secondary mt-0.5">Completed</p>
            </div>
            <div className="bg-background rounded-lg p-3">
              <p className="text-lg font-bold text-text-primary">{pendingTests}</p>
              <p className="text-[10px] text-text-secondary mt-0.5">Not Started</p>
            </div>
            <div className="bg-background rounded-lg p-3">
              <p className="text-lg font-bold text-text-primary">0</p>
              <p className="text-[10px] text-text-secondary mt-0.5">In Progress</p>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs text-text-secondary bg-background p-3 rounded-lg">
            <span>Avg Test Time: <span className="font-semibold text-text-primary">34 mins</span></span>
            <span>Malpractice Rate: <span className="font-semibold text-danger">{((malpracticeCount / (testsCompleted || 1)) * 100).toFixed(1)}%</span></span>
          </div>
        </div>
      </div>

      {/* Main Student Management Table */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-text-primary">Student Management Registry</h2>
        <StudentTable
          students={students}
          examResults={examResults}
          getLatestExamResult={getLatestExamResult}
          loading={loading}
          error={error}
          onUpdateStudent={updateStudent}
        />
      </div>
    </div>
  );
}
