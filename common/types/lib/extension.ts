import { GradeEntry } from "./course"
export interface CampusmateCourseRecord {
  subject: string
  category: string
  unit: string
  letter_evaluation: string
  gp: string
  year: string
  quarter: string
  numberlink: string
  course_id: string
  prinstructor: string
  last_updated: string
}

export interface CampusmateCourseResults
{
  tHeadNameMap: Object,
  categories: string[],
  course_grades: CampusmateCourseRecord[] | GradeEntry[],
} 