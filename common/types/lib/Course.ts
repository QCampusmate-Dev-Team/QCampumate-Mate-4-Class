import { SCHOOL, QUARTER, LETTER_EVALUATION } from './Constants'
import { stringOrUndefined } from './utils'

export type CourseCategory = string | undefined; 

export interface Course {
  subject: string;
  school?: SCHOOL;
  major?: string | undefined;
  subjectCode?: string | undefined;
  unit?: number;
  target_students_from?: stringOrUndefined;
  target_year?: stringOrUndefined;
  quarter?: QUARTER;
}


export interface GradeEntry extends Course { // GradeEntry should extend Course!! FIX THE INCONSISTENCY IN PROPERTY NAMES!!
  category?: CourseCategory,
  letter_evaluation?: LETTER_EVALUATION,
  gpa?: number | undefined,
  year?: number | undefined,
  quarter?: QUARTER,
  numberlink?: string | undefined, //"KED-KES1111J"
  course_id?: number | undefined,
  prinstructor?: string | undefined,
  last_updated?: Date | undefined,
  matched?: boolean
}

export interface CourseMeta {

}
