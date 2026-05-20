export type ExamStatus = 'Evaluated' | 'Malpractice';

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
};

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
