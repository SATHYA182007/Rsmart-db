import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, DollarSign, Users, CheckCircle2, AlertTriangle, Sparkles, RefreshCw, X, Check, Eye
} from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';
import { Scholarship, Student } from '@/types';

export default function Scholarships() {
  const { students, scholarships, loading, error, saveScholarshipStatus, reload } = useAppData();
  const [selectedSch, setSelectedSch] = useState<Scholarship | null>(null);
  const [amountInput, setAmountInput] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // ─── Financial Calculations ────────────────────────────────────────────────
  const totalBudget = 500000; // Mock total budget allocated for current cycle
  const approvedSchs = scholarships.filter(s => s.approval_status === 'Approved');
  const totalAllocated = approvedSchs.reduce((sum, current) => sum + current.amount, 0);
  const remainingBudget = Math.max(0, totalBudget - totalAllocated);
  const averageAmount = approvedSchs.length ? Math.round(totalAllocated / approvedSchs.length) : 0;

  const handleUpdate = async (id: string, status: string, amt?: number) => {
    try {
      await saveScholarshipStatus(id, status, amt);
      setModalOpen(false);
      setSelectedSch(null);
    } catch (err) {
      console.error(err);
    }
  };

  const getStudentName = (sid: string) => {
    const s = students.find(x => x.id === sid);
    return s ? s.name : 'Unknown Student';
  };

  const getStudent12th = (sid: string) => {
    const s = students.find(x => x.id === sid);
    return s ? `${s.percentage_12th}%` : '—';
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-border rounded-xl p-6 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-primary" />
            <h1 className="text-xl font-bold text-text-primary">Scholarship Approval Engine</h1>
          </div>
          <p className="text-xs text-text-secondary mt-1">Review merit-based funding requests, track allocated budget, and approve waivers.</p>
        </div>
        <button
          onClick={reload}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg text-xs font-semibold hover:bg-background transition"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Sync Supabase
        </button>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Scholarship Budget', value: `₹${totalBudget.toLocaleString('en-IN')}`, desc: 'Total allocated pool', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Allocated Budget', value: `₹${totalAllocated.toLocaleString('en-IN')}`, desc: 'Current approved funding', color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Remaining Budget Pool', value: `₹${remainingBudget.toLocaleString('en-IN')}`, desc: 'Available for approval', color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Average Award Grant', value: `₹${averageAmount.toLocaleString('en-IN')}`, desc: 'Per qualified student', color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((card, i) => (
          <div key={i} className="bg-white border border-border rounded-xl p-5 shadow-soft">
            <p className="text-xs font-semibold text-text-secondary">{card.label}</p>
            <p className={`text-xl font-bold mt-2 ${card.color}`}>{card.value}</p>
            <p className="text-[10px] text-text-secondary mt-0.5">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Scholarship Workflow Grid */}
      <div className="bg-white border border-border rounded-xl shadow-soft overflow-hidden">
        <div className="p-5 border-b border-border bg-white flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-text-primary">Scholarship Eligible Applicants</h3>
            <p className="text-[10px] text-text-secondary mt-0.5">Applicants qualifying for merit-based financial waivers</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-background text-text-secondary font-bold uppercase border-b border-border text-[10px] tracking-wider">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">12th Grade %</th>
                <th className="px-6 py-4">Scholarship Category</th>
                <th className="px-6 py-4 text-center">Amount Offered</th>
                <th className="px-6 py-4 text-center">Approval Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-text-secondary">Syncing with Supabase...</td>
                </tr>
              ) : scholarships.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-text-secondary">No scholarship applicants registered.</td>
                </tr>
              ) : (
                scholarships.map(sch => (
                  <tr key={sch.id} className="hover:bg-blue-50/10 transition-colors">
                    <td className="px-6 py-3.5 font-semibold text-text-primary">{getStudentName(sch.student_id)}</td>
                    <td className="px-6 py-3.5 text-text-secondary font-medium">{getStudent12th(sch.student_id)}</td>
                    <td className="px-6 py-3.5 text-text-primary font-medium">{sch.scholarship_type}</td>
                    <td className="px-6 py-3.5 text-center font-mono font-bold text-text-primary">₹{sch.amount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sch.approval_status === 'Approved' ? 'bg-green-100 text-green-700' :
                        sch.approval_status === 'Rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {sch.approval_status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      {sch.approval_status === 'Pending' ? (
                        <div className="flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => { setSelectedSch(sch); setAmountInput(String(sch.amount)); setModalOpen(true); }}
                            className="px-2.5 py-1 bg-primary text-white font-bold rounded text-[10px] hover:bg-blue-600 transition"
                          >
                            Review
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-text-secondary font-medium">Decided</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {modalOpen && selectedSch && (
        <div className="fixed inset-0 bg-text-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl border border-border shadow-premium max-w-sm w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-text-primary">Review Merit Waiver</h3>
                <p className="text-[10px] text-text-secondary mt-0.5">Candidate: {getStudentName(selectedSch.student_id)}</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-text-secondary hover:text-text-primary"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase mb-1 block">Waiver Amount (₹)</label>
                <input
                  type="number"
                  value={amountInput}
                  onChange={e => setAmountInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-white text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleUpdate(selectedSch.id, 'Approved', Number(amountInput))}
                  className="py-2.5 bg-green-600 text-white font-semibold rounded-xl text-xs hover:bg-green-700 transition flex items-center justify-center gap-1.5"
                >
                  <Check size={14} /> Approve
                </button>
                <button
                  onClick={() => handleUpdate(selectedSch.id, 'Rejected')}
                  className="py-2.5 bg-red-600 text-white font-semibold rounded-xl text-xs hover:bg-red-700 transition flex items-center justify-center gap-1.5"
                >
                  <X size={14} /> Deny
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
