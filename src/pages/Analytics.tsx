import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { FileDown, FileSpreadsheet, Printer, Download, Sparkles, RefreshCw, Star, ShieldAlert } from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';
import { formatCourse } from '@/types';

const COLORS = ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'];

// Static stats for reviewer productivity simulation
const reviewerStats = [
  { name: 'Admin Sarah', reviews: 24, avgTime: '12m', pending: 3, approvalRate: '75%' },
  { name: 'Reviewer Dave', reviews: 18, avgTime: '15m', pending: 5, approvalRate: '68%' },
  { name: 'Staff Jenkins', reviews: 31, avgTime: '9m', pending: 1, approvalRate: '82%' },
];

export default function Analytics() {
  const { students, examResults, scholarships, loading, reload } = useAppData();

  const total = students.length;
  const evaluated = examResults.filter(r => r.status === 'Evaluated');
  const passed = evaluated.filter(r => r.percentage >= 50).length;
  const passPercent = evaluated.length ? Math.round((passed / evaluated.length) * 100) : 0;

  // ─── Department-wise Applications ─────────────────────────────────────────
  const deptCounts: Record<string, number> = {};
  students.forEach(s => {
    const label = formatCourse(s.course);
    deptCounts[label] = (deptCounts[label] ?? 0) + 1;
  });
  const deptData = Object.entries(deptCounts).map(([name, count]) => ({ name, count }));

  // ─── State-wise Applications ───────────────────────────────────────────────
  const stateCounts: Record<string, number> = {};
  students.forEach(s => {
    stateCounts[s.state] = (stateCounts[s.state] ?? 0) + 1;
  });
  const stateData = Object.entries(stateCounts)
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count);

  // ─── Scholarship status ────────────────────────────────────────────────────
  const meritCount = students.filter(s => s.scholarship_eligible).length;
  const schData = [
    { name: 'Scholarship Qualified', count: meritCount },
    { name: 'General Applicants', count: total - meritCount },
  ];

  // ─── Export simulation functions ───────────────────────────────────────────
  const handleExport = (type: 'pdf' | 'excel' | 'print') => {
    alert(`Exporting RSmart admission reports as ${type.toUpperCase()}... File download started.`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-text-secondary">
        <RefreshCw size={22} className="animate-spin" />
        <span>Syncing database analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-border rounded-xl p-6 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-primary" />
            <h1 className="text-xl font-bold text-text-primary">Executive Analytics Dashboard</h1>
          </div>
          <p className="text-xs text-text-secondary mt-1">Deep analytics on conversion rates, reviewer productivity, and student cohorts.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button onClick={() => handleExport('pdf')} className="flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg text-xs font-semibold hover:bg-background transition">
            <FileDown size={14} className="text-red-500" /> Export PDF
          </button>
          <button onClick={() => handleExport('excel')} className="flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg text-xs font-semibold hover:bg-background transition">
            <FileSpreadsheet size={14} className="text-green-600" /> Export Excel
          </button>
          <button onClick={() => handleExport('print')} className="flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg text-xs font-semibold hover:bg-background transition">
            <Printer size={14} className="text-blue-600" /> Print Report
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall Pass Percentage', value: `${passPercent}%`, desc: `${passed} qualified applicants` },
          { label: 'Total Cohort Intake', value: total, desc: 'Students registered in DB' },
          { label: 'Evaluation Queue Finish', value: `${evaluated.length}/${total}`, desc: 'Total tests processed' },
          { label: 'Scholarships Awarded', value: meritCount, desc: 'Meritorious scholarship qualifiers' },
        ].map((card, i) => (
          <div key={i} className="bg-white border border-border rounded-xl p-5 shadow-soft">
            <p className="text-xs font-semibold text-text-secondary">{card.label}</p>
            <p className="text-2xl font-bold text-text-primary mt-2">{card.value}</p>
            <p className="text-[10px] text-text-secondary mt-0.5">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department-wise Applications */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-soft space-y-4">
          <div>
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Department-wise Applications</h3>
            <p className="text-[10px] text-text-secondary mt-0.5">Application metrics organized by department streams</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ left: -15, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EEF9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} dx={-4} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Applicants" barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* State-wise applications */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-soft space-y-4">
          <div>
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Geographic Reach</h3>
            <p className="text-[10px] text-text-secondary mt-0.5">Top performing states based on intake numbers</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5EEF9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
                <YAxis type="category" dataKey="state" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Bar dataKey="count" fill="#60A5FA" radius={[0, 4, 4, 0]} name="Applicants" barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Scholarship and Reviewer productivity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scholarship breakdown */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-soft space-y-4">
          <div>
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Scholarship Allocation</h3>
            <p className="text-[10px] text-text-secondary mt-0.5">Applicants matching the merit criteria</p>
          </div>
          <div className="h-56 flex flex-col justify-between">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={schData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="count" paddingAngle={2}>
                  {schData.map((e, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 text-[11px] font-semibold text-text-secondary">
              {schData.map((s, idx) => (
                <div key={s.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span>{s.name}</span>
                  </div>
                  <span className="text-text-primary font-bold">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviewer Productivity */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-soft lg:col-span-2 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Reviewer Productivity Metrics</h3>
            <p className="text-[10px] text-text-secondary mt-0.5">Active workload tracking for verification admins</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-background text-text-secondary font-bold uppercase border-b border-border">
                  <th className="px-4 py-3">Reviewer Name</th>
                  <th className="px-4 py-3 text-center">Reviews Completed</th>
                  <th className="px-4 py-3 text-center">Avg Time</th>
                  <th className="px-4 py-3 text-center">Pending Cases</th>
                  <th className="px-4 py-3 text-right">Approval Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reviewerStats.map(r => (
                  <tr key={r.name} className="hover:bg-blue-50/10">
                    <td className="px-4 py-3 font-semibold text-text-primary">{r.name}</td>
                    <td className="px-4 py-3 text-center font-bold text-text-primary">{r.reviews}</td>
                    <td className="px-4 py-3 text-center text-text-secondary">{r.avgTime}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold">{r.pending}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-green-600">{r.approvalRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
