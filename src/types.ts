// ─── Enums & Union Types ───────────────────────────────────────────────────────
export type ExamStatus = 'Evaluated' | 'Malpractice';
export type RankingBand = 'Distinguished' | 'Proficient' | 'Advanced' | 'Emerging';
export type AdmissionStatus = 'Applied' | 'Shortlisted' | 'Interviewed' | 'Approved' | 'Rejected' | 'Enrolled';
export type ReviewStatus = 'Pending' | 'In Review' | 'Reviewed';
export type PaymentStatus = 'Paid' | 'Pending' | 'Waived';
export type InterviewStatus = 'Scheduled' | 'Completed' | 'Rescheduled' | 'Missed' | 'Feedback Submitted';

// ─── Student ───────────────────────────────────────────────────────────────────
export type Student = {
  id: string;
  created_at: string;
  name: string;
  father_name: string;
  dob: string;
  gender: string;
  mobile: string;
  email: string;
  state: string;
  city: string;
  group_12th: string;
  marks_12th: number;
  marks_10th: number;
  percentage_12th: number;
  percentage_10th: number;
  course: string;
  application_no: number;
  ug_status: string;
  ug_score: number | null;
  exam_set: string;
  ranking_band?: RankingBand | null;
  scholarship_eligible?: boolean | null;
  admission_status?: AdmissionStatus | null;
  review_status?: ReviewStatus | null;
  payment_status?: PaymentStatus | null;
  communication_status?: string | null;
  notes?: string | null;
};

// ─── Exam Result ───────────────────────────────────────────────────────────────
export type ExamResult = {
  id: string;
  student_id: string;
  exam_set: string;
  section_a_score: number;
  section_b_score: number;
  section_c_score: number;
  section_d_score: number;
  total_score: number;
  percentage: number;
  status: ExamStatus;
  raw_answers: Record<string, string>;
  ai_feedback: string;
  completed_at: string;
};

// ─── Interview ─────────────────────────────────────────────────────────────────
export type Interview = {
  id: string;
  student_id: string;
  interviewer_name: string;
  interview_date: string;
  interview_time: string;
  interview_status: InterviewStatus;
  feedback: string | null;
  rating: number | null;
  recommendation: string | null;
};

// ─── Scholarship ───────────────────────────────────────────────────────────────
export type Scholarship = {
  id: string;
  student_id: string;
  scholarship_type: string;
  amount: number;
  approval_status: string;
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
export const COURSE_LABELS: Record<string, string> = {
  arts_science: 'Arts & Science',
  mba: 'MBA',
  engineering: 'Engineering',
  bca: 'BCA',
  bcom: 'B.Com',
};

export function formatCourse(course: string): string {
  return COURSE_LABELS[course] ?? course;
}

export function getRankingBand(percentage: number): RankingBand {
  if (percentage >= 76) return 'Distinguished';
  if (percentage >= 51) return 'Proficient';
  if (percentage >= 26) return 'Advanced';
  return 'Emerging';
}

export const RANKING_BAND_STYLES: Record<RankingBand, string> = {
  Distinguished: 'bg-purple-100 text-purple-700 border border-purple-200',
  Proficient: 'bg-blue-100 text-blue-700 border border-blue-200',
  Advanced: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  Emerging: 'bg-orange-100 text-orange-700 border border-orange-200',
};

export const ADMISSION_STATUS_STYLES: Record<AdmissionStatus, string> = {
  Applied: 'bg-gray-100 text-gray-600',
  Shortlisted: 'bg-blue-100 text-blue-700',
  Interviewed: 'bg-indigo-100 text-indigo-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  Enrolled: 'bg-emerald-100 text-emerald-700',
};
