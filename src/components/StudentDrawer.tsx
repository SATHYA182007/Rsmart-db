import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, BookOpen, GraduationCap, Phone, Mail, MapPin, AlertTriangle, CheckCircle2, Brain, Hash } from 'lucide-react';
import { Student, ExamResult } from '@/types';
import { formatCourse } from '@/types';

interface StudentDrawerProps {
  student: Student | null;
  examResult: ExamResult | null;
  isOpen: boolean;
  onClose: () => void;
}

const sectionLabels = ['Section A', 'Section B', 'Section C', 'Section D'];

export default function StudentDrawer({ student, examResult, isOpen, onClose }: StudentDrawerProps) {
  if (!student) return null;

  const examStatusStyle = examResult?.status === 'Malpractice'
    ? 'bg-red-100 text-red-700 border border-red-200'
    : 'bg-green-100 text-green-700 border border-green-200';

  const sectionScores = examResult
    ? [examResult.section_a_score, examResult.section_b_score, examResult.section_c_score, examResult.section_d_score]
    : [];

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
            animate={{ x: 0, boxShadow: '-10px 0 40px -10px rgba(0,0,0,0.12)' }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-background border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-white border-b border-border sticky top-0 z-10">
              <h2 className="text-xl font-bold text-text-primary">Application Details</h2>
              <button onClick={onClose} className="p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Profile */}
              <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <h3 className="text-xl font-bold text-text-primary">{student.name}</h3>
                      <p className="text-primary font-medium text-sm">App #{student.application_no}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <BookOpen size={15} className="text-primary shrink-0" />
                      <span>{formatCourse(student.course)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <User size={15} className="text-primary shrink-0" />
                      <span>Father: {student.father_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Phone size={15} className="text-primary shrink-0" />
                      <span>{student.mobile}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Mail size={15} className="text-primary shrink-0" />
                      <span className="truncate">{student.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary md:col-span-2">
                      <MapPin size={15} className="text-primary shrink-0" />
                      <span>{student.city}, {student.state}</span>
                    </div>
                  </div>
                </div>
                {/* Extra info row */}
                <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-text-secondary">Gender</p>
                    <p className="font-semibold text-text-primary text-sm">{student.gender}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">UG Status</p>
                    <p className="font-semibold text-text-primary text-sm">{student.ug_status}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">UG Score</p>
                    <p className="font-semibold text-text-primary text-sm">{student.ug_score ?? '—'}</p>
                  </div>
                </div>
              </div>

              {/* Academic Details */}
              <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <GraduationCap className="text-primary" size={18} />
                  <h4 className="font-bold text-text-primary">Academic Details</h4>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">12th Grade ({student.group_12th})</span>
                    <span className="font-bold text-text-primary">{student.percentage_12th}%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${Math.min(student.percentage_12th, 100)}%` }} />
                  </div>
                  <p className="text-xs text-text-secondary mt-1">{student.marks_12th} marks</p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">10th Grade</span>
                    <span className="font-bold text-text-primary">{student.percentage_10th}%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full transition-all" style={{ width: `${Math.min(student.percentage_10th, 100)}%` }} />
                  </div>
                  <p className="text-xs text-text-secondary mt-1">{student.marks_10th} marks</p>
                </div>
              </div>

              {/* Exam Result */}
              {examResult ? (
                <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="text-primary" size={18} />
                      <h4 className="font-bold text-text-primary">Exam Result</h4>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${examStatusStyle}`}>
                      {examResult.status === 'Malpractice' ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                      {examResult.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-background rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-text-primary">{examResult.total_score}</p>
                      <p className="text-xs text-text-secondary mt-0.5">Total Score</p>
                    </div>
                    <div className="bg-background rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-text-primary">{examResult.percentage.toFixed(1)}%</p>
                      <p className="text-xs text-text-secondary mt-0.5">Percentage</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Section Scores</p>
                    <div className="space-y-2">
                      {sectionScores.map((score, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-xs text-text-secondary w-20 shrink-0">{sectionLabels[i]}</span>
                          <div className="flex-1 bg-background rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${Math.min((score / 30) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-text-primary w-5 text-right">{score}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-background rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain size={14} className="text-primary" />
                      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">AI Feedback</p>
                    </div>
                    <p className="text-sm text-text-primary leading-relaxed">{examResult.ai_feedback}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <span>Exam Set: <span className="font-medium text-text-primary uppercase">{examResult.exam_set}</span></span>
                    <span>Completed: {new Date(examResult.completed_at).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-dashed border-border p-8 text-center">
                  <p className="text-text-secondary text-sm">No exam result available for this student.</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
