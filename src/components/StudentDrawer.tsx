import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, User, BookOpen, GraduationCap, Phone, Mail, MapPin,
  AlertTriangle, CheckCircle2, Brain, Hash, MessageSquare,
  Calendar, Check, UserMinus, Plus, PhoneCall, Send, ShieldAlert, Clock
} from 'lucide-react';
import { Student, ExamResult, AdmissionStatus, ReviewStatus } from '@/types';
import { formatCourse } from '@/types';

interface StudentDrawerProps {
  student: Student | null;
  examResult: ExamResult | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStudent: (id: string, updates: Partial<Student>) => Promise<void>;
}

const sectionLabels = ['Section A', 'Section B', 'Section C', 'Section D'];

export default function StudentDrawer({
  student,
  examResult,
  isOpen,
  onClose,
  onUpdateStudent
}: StudentDrawerProps) {
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (student) {
      setNotes(student.notes || '');
    }
  }, [student]);

  if (!student) return null;

  const currentStatus: AdmissionStatus = student.admission_status || 'Applied';
  const currentReview: ReviewStatus = student.review_status || 'Pending';

  // ─── Timeline Stages ────────────────────────────────────────────────────────
  const stages: { label: AdmissionStatus; key: string }[] = [
    { label: 'Applied', key: 'Applied' },
    { label: 'Shortlisted', key: 'Shortlisted' },
    { label: 'Interviewed', key: 'Interviewed' },
    { label: 'Approved', key: 'Approved' },
    { label: 'Enrolled', key: 'Enrolled' },
  ];

  const currentStageIndex = stages.findIndex(s => s.label === currentStatus);

  const handleUpdateStatus = async (status: AdmissionStatus, review?: ReviewStatus) => {
    setSaving(true);
    try {
      const updates: Partial<Student> = { admission_status: status };
      if (review) updates.review_status = review;
      await onUpdateStudent(student.id, updates);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      await onUpdateStudent(student.id, { notes });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleCommunication = async (comm: string) => {
    setSaving(true);
    try {
      await onUpdateStudent(student.id, { communication_status: comm });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const commStatus = student.communication_status || 'None';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-text-primary/20 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-background border-l border-border z-50 flex flex-col shadow-premium"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-white border-b border-border sticky top-0 z-10">
              <div>
                <h2 className="text-lg font-bold text-text-primary">Applicant Profile</h2>
                <p className="text-xs text-text-secondary mt-0.5">Application No: #{student.application_no}</p>
              </div>
              <div className="flex items-center gap-3">
                {saving && <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
                <button onClick={onClose} className="p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Profile Details */}
              <div className="bg-white rounded-xl border border-border p-6 shadow-soft space-y-4">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                    {(student.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <h3 className="text-base font-bold text-text-primary">{student.name}</h3>
                    <p className="text-xs text-text-secondary">Father's Name: {student.father_name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-text-secondary">Course Preferred</p>
                    <p className="font-semibold text-text-primary mt-0.5">{formatCourse(student.course)}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Email Address</p>
                    <p className="font-semibold text-text-primary mt-0.5 truncate">{student.email}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Phone Number</p>
                    <p className="font-semibold text-text-primary mt-0.5">{student.mobile}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Location</p>
                    <p className="font-semibold text-text-primary mt-0.5">{student.city}, {student.state}</p>
                  </div>
                </div>
              </div>

              {/* Admission Workflow Timeline */}
              <div className="bg-white rounded-xl border border-border p-6 shadow-soft space-y-4">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Admission Progress Timeline</p>
                <div className="flex items-center justify-between relative mt-2">
                  <div className="absolute left-2 right-2 top-3 h-[2px] bg-border z-0" />
                  <div className="absolute left-2 top-3 h-[2px] bg-primary z-0 transition-all duration-300" style={{ width: `${(Math.max(0, currentStageIndex) / (stages.length - 1)) * 100}%` }} />
                  {stages.map((stage, i) => {
                    const active = i <= currentStageIndex;
                    return (
                      <div key={stage.label} className="flex flex-col items-center z-10">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${active ? 'bg-primary text-white' : 'bg-white border-2 border-border text-text-secondary'}`}>
                          {active ? <Check size={12} /> : i + 1}
                        </div>
                        <span className="text-[10px] font-semibold mt-1 text-text-secondary">{stage.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review & Status Management */}
              <div className="bg-white rounded-xl border border-border p-6 shadow-soft space-y-4">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Review & Status Management</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleUpdateStatus('Shortlisted', 'In Review')} className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 transition">
                    <Calendar size={13} /> Shortlist for Interview
                  </button>
                  <button onClick={() => handleUpdateStatus('Approved', 'Reviewed')} className="flex items-center gap-1.5 px-3 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-100 transition">
                    <CheckCircle2 size={13} /> Approve Admission
                  </button>
                  <button onClick={() => handleUpdateStatus('Rejected', 'Reviewed')} className="flex items-center gap-1.5 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-100 transition">
                    <UserMinus size={13} /> Reject Applicant
                  </button>
                  <button onClick={() => handleUpdateStatus('Enrolled', 'Reviewed')} className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg text-xs font-semibold hover:bg-purple-100 transition">
                    <Plus size={13} /> Mark Enrolled
                  </button>
                </div>
              </div>

              {/* Communication Tracking */}
              <div className="bg-white rounded-xl border border-border p-6 shadow-soft space-y-4">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Communication Status</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Called', icon: PhoneCall },
                    { label: 'Email Sent', icon: Mail },
                    { label: 'WhatsApp Contacted', icon: MessageSquare },
                    { label: 'Interview Reminder Sent', icon: Send },
                  ].map(c => (
                    <button
                      key={c.label}
                      onClick={() => handleCommunication(c.label)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold transition border ${
                        commStatus === c.label
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white border-border text-text-primary hover:bg-background'
                      }`}
                    >
                      <c.icon size={13} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Academic Details */}
              <div className="bg-white rounded-xl border border-border p-6 shadow-soft space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <GraduationCap size={16} className="text-primary" />
                  <p className="text-xs font-bold text-text-primary uppercase tracking-wider">Academic Portfolio</p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-background rounded-lg p-2.5">
                    <p className="text-xs text-text-secondary">10th Marks</p>
                    <p className="text-sm font-bold text-text-primary mt-0.5">{student.marks_10th} ({student.percentage_10th}%)</p>
                  </div>
                  <div className="bg-background rounded-lg p-2.5">
                    <p className="text-xs text-text-secondary">12th Marks</p>
                    <p className="text-sm font-bold text-text-primary mt-0.5">{student.marks_12th} ({student.percentage_12th}%)</p>
                  </div>
                  <div className="bg-background rounded-lg p-2.5">
                    <p className="text-xs text-text-secondary">UG Score</p>
                    <p className="text-sm font-bold text-text-primary mt-0.5">{student.ug_score ?? '—'}</p>
                  </div>
                </div>
              </div>

              {/* Exam & AI Panel */}
              {examResult ? (
                <div className="bg-white rounded-xl border border-border p-6 shadow-soft space-y-4">
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <div className="flex items-center gap-2">
                      <Hash size={16} className="text-primary" />
                      <p className="text-xs font-bold text-text-primary uppercase tracking-wider">Exam Results</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                      examResult.status === 'Malpractice' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {examResult.status === 'Malpractice' ? <ShieldAlert size={12} /> : <CheckCircle2 size={12} />}
                      {examResult.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-background rounded-lg p-3">
                      <p className="text-xl font-bold text-text-primary">{examResult.total_score}</p>
                      <p className="text-[10px] text-text-secondary mt-0.5">Total Score</p>
                    </div>
                    <div className="bg-background rounded-lg p-3">
                      <p className="text-xl font-bold text-text-primary">{(examResult.percentage || 0).toFixed(1)}%</p>
                      <p className="text-[10px] text-text-secondary mt-0.5">Percentile</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold text-text-secondary uppercase">Section Breakdown</p>
                    {[
                      { name: 'Sec A (Logical)', val: examResult.section_a_score },
                      { name: 'Sec B (Quantitative)', val: examResult.section_b_score },
                      { name: 'Sec C (Language)', val: examResult.section_c_score },
                      { name: 'Sec D (Subject)', val: examResult.section_d_score },
                    ].map(sec => (
                      <div key={sec.name} className="flex items-center gap-3">
                        <span className="text-xs text-text-secondary w-32 shrink-0">{sec.name}</span>
                        <div className="flex-1 bg-background rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${(sec.val / 25) * 100}%` }} />
                        </div>
                        <span className="text-xs font-bold text-text-primary w-6 text-right">{sec.val}/25</span>
                      </div>
                    ))}
                  </div>

                  {/* AI Feedback */}
                  <div className="bg-background border border-border rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                      <Brain size={14} />
                      <span>AI ASSESSMENT INSIGHT</span>
                    </div>
                    <p className="text-xs text-text-primary leading-relaxed">{examResult.ai_feedback}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-dashed border-border p-8 text-center">
                  <p className="text-xs text-text-secondary">Pending admission exam result evaluation.</p>
                </div>
              )}

              {/* Notes Field */}
              <div className="bg-white rounded-xl border border-border p-6 shadow-soft space-y-3">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Reviewer internal notes</p>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Enter reviewer feedback, observation details..."
                  className="w-full rounded-xl border border-border bg-white text-xs p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  onClick={handleSaveNotes}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-blue-600 transition"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
