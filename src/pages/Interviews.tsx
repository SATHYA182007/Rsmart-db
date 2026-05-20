import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, User, MessageSquare, Star, Plus, ShieldCheck,
  CheckCircle, AlertCircle, RefreshCw, Sparkles, ChevronRight, X
} from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';
import { Interview, InterviewStatus, Student } from '@/types';

export default function Interviews() {
  const { students, interviews, loading, error, saveInterview, reload } = useAppData();
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  // Form states for schedule
  const [studentId, setStudentId] = useState('');
  const [interviewer, setInterviewer] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Form states for feedback
  const [rating, setRating] = useState(5);
  const [recommendation, setRecommendation] = useState('Highly Recommended');
  const [feedbackNotes, setFeedbackNotes] = useState('');

  // Filter students who haven't completed their interviews
  const availableStudents = students.filter(s =>
    !interviews.some(i => i.student_id === s.id && i.interview_status === 'Completed')
  );

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !interviewer || !date || !time) return;

    try {
      await saveInterview({
        student_id: studentId,
        interviewer_name: interviewer,
        interview_date: date,
        interview_time: time,
        interview_status: 'Scheduled',
      });
      setScheduleOpen(false);
      setStudentId('');
      setInterviewer('');
      setDate('');
      setTime('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInterview) return;

    try {
      await saveInterview({
        ...selectedInterview,
        rating,
        recommendation,
        feedback: feedbackNotes,
        interview_status: 'Completed',
      });
      setFeedbackOpen(false);
      setSelectedInterview(null);
      setFeedbackNotes('');
    } catch (err) {
      console.error(err);
    }
  };

  const getStudentName = (sid: string) => {
    const s = students.find(x => x.id === sid);
    return s ? s.name : 'Unknown Student';
  };

  const getStudentCourse = (sid: string) => {
    const s = students.find(x => x.id === sid);
    return s ? s.course : 'mba';
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-border rounded-xl p-6 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-primary" />
            <h1 className="text-xl font-bold text-text-primary">Interview Management Portal</h1>
          </div>
          <p className="text-xs text-text-secondary mt-1">Schedule reviews, submit interview outcomes, and track candidate evaluations.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setScheduleOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-blue-600 transition shadow-soft"
          >
            <Plus size={14} /> Schedule Interview
          </button>
        </div>
      </div>

      {/* Grid of interview schedules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scheduled / Upcoming Column */}
        <div className="bg-white border border-border rounded-xl p-5 shadow-soft space-y-4 lg:col-span-2">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <h3 className="text-sm font-bold text-text-primary">Upcoming Schedules</h3>
            <span className="bg-blue-50 text-primary px-2.5 py-0.5 rounded-full text-[10px] font-bold">
              {interviews.filter(i => i.interview_status === 'Scheduled').length} pending
            </span>
          </div>

          {loading ? (
            <div className="text-center py-8 text-xs text-text-secondary">Syncing with Supabase...</div>
          ) : interviews.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-xl">
              <p className="text-xs text-text-secondary">No interviews scheduled yet. Use "Schedule Interview" to get started.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {interviews.map(interview => {
                const sName = getStudentName(interview.student_id);
                const isCompleted = interview.interview_status === 'Completed';

                return (
                  <div key={interview.id} className="p-4 border border-border rounded-xl hover:border-primary/30 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-background">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                        {sName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-text-primary text-xs">{sName}</h4>
                        <p className="text-[10px] text-text-secondary mt-0.5">Interviewer: <span className="font-semibold text-text-primary">{interview.interviewer_name}</span></p>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-text-secondary font-medium">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {interview.interview_date}</span>
                          <span className="flex items-center gap-1"><Clock size={12} /> {interview.interview_time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {interview.interview_status}
                      </span>
                      {!isCompleted && (
                        <button
                          onClick={() => { setSelectedInterview(interview); setFeedbackOpen(true); }}
                          className="flex items-center gap-1 px-2.5 py-1 bg-white border border-border hover:bg-primary/10 hover:text-primary rounded text-[10px] font-bold transition shrink-0"
                        >
                          Feedback <ChevronRight size={11} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Evaluation Summary Side Card */}
        <div className="bg-white border border-border rounded-xl p-5 shadow-soft space-y-4">
          <h3 className="text-sm font-bold text-text-primary border-b border-border pb-2">Feedback Logs</h3>
          <div className="space-y-3.5 max-h-[500px] overflow-y-auto">
            {interviews.filter(i => i.interview_status === 'Completed').length === 0 ? (
              <p className="text-xs text-text-secondary py-8 text-center">No feedback submitted yet.</p>
            ) : (
              interviews.filter(i => i.interview_status === 'Completed').map(i => (
                <div key={i.id} className="p-3 border border-border rounded-lg bg-background text-[11px] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-text-primary">{getStudentName(i.student_id)}</span>
                    <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold text-[9px]">Completed</span>
                  </div>
                  <div className="flex items-center gap-1 text-orange-500">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} size={11} className={idx < (i.rating || 0) ? 'fill-orange-500' : 'opacity-30'} />
                    ))}
                    <span className="text-[10px] text-text-secondary font-semibold ml-1">({i.rating}/5)</span>
                  </div>
                  <p className="text-text-primary italic">"{i.feedback}"</p>
                  <p className="text-[10px] text-text-secondary font-medium">Rec: <span className="font-bold text-primary">{i.recommendation}</span></p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {scheduleOpen && (
        <div className="fixed inset-0 bg-text-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl border border-border shadow-premium max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="text-sm font-bold text-text-primary">Schedule New Interview</h3>
              <button onClick={() => setScheduleOpen(false)} className="text-text-secondary hover:text-text-primary"><X size={18} /></button>
            </div>
            <form onSubmit={handleScheduleSubmit} className="space-y-3.5">
              <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase mb-1 block">Applicant</label>
                <select value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-white text-xs focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Select Candidate</option>
                  {availableStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({getStudentCourse(s.id)})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase mb-1 block">Interviewer Name</label>
                <input value={interviewer} onChange={e => setInterviewer(e.target.value)} placeholder="Prof. Sarah Jenkins" className="w-full px-3 py-2 rounded-xl border border-border bg-white text-xs focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-text-secondary uppercase mb-1 block">Date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-white text-xs focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-text-secondary uppercase mb-1 block">Time</label>
                  <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-white text-xs focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 bg-primary text-white font-semibold rounded-xl text-xs hover:bg-blue-600 transition shadow-soft">
                Confirm Schedule
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Submit Feedback Modal */}
      {feedbackOpen && selectedInterview && (
        <div className="fixed inset-0 bg-text-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl border border-border shadow-premium max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-text-primary">Provide Interview Feedback</h3>
                <p className="text-[10px] text-text-secondary mt-0.5">Candidate: {getStudentName(selectedInterview.student_id)}</p>
              </div>
              <button onClick={() => setFeedbackOpen(false)} className="text-text-secondary hover:text-text-primary"><X size={18} /></button>
            </div>
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase mb-1 block">Interviewer Rating (1-5)</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} type="button" onClick={() => setRating(n)} className="p-1">
                      <Star size={20} className={n <= rating ? 'text-orange-500 fill-orange-500' : 'text-text-secondary opacity-30'} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase mb-1 block">Recommendation Status</label>
                <select value={recommendation} onChange={e => setRecommendation(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-white text-xs focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="Highly Recommended">Highly Recommended</option>
                  <option value="Recommended">Recommended</option>
                  <option value="Hold">On Hold</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase mb-1 block">Feedback Comments</label>
                <textarea value={feedbackNotes} onChange={e => setFeedbackNotes(e.target.value)} placeholder="Submit detailed observation..." className="w-full rounded-xl border border-border bg-white text-xs p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-primary text-white font-semibold rounded-xl text-xs hover:bg-blue-600 transition shadow-soft">
                Submit Outcome
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
