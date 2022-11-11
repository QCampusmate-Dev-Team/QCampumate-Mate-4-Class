export interface DR {
  meta: StudentInfo;
  req: Req[];
}

export interface StudentInfo {
  enrollment: Date;
  school: School; 
  major: string | undefined;
  field: string | undefined;
  lang1st: string | undefined;
  lang2nd: string | undefined;
  isItrntnlStd: boolean;
}

interface Req extends _Req {
  school: School;
  minFirstYear?: number 
}

// 葉要件
export interface LeafReq extends _Req{
  elecComp: 1 | 2 | 3 ;
  major: string | string[] | undefined;
  matchOptions: MatchOptions;
}

// A minimal tree structure for consistency with Element Plus UI
interface _Req {
  label: string;
  minUnit: number;
  children?: _Req[];
}

export interface MatchOptions {
  mustHas?: MustHasOptions; 
  include?: ExIncludeOptions; 
  exclude?: ExIncludeOptions; 
}

interface MustHasOptions {
  courses?: Course[]; // priority 1
  majors?: string[];
  like?: RegExp; // priority 2
}

interface ExIncludeOptions {
  like?: RegExp;
  courses?: Course[];
  schools?: School[];
  majors?: string[];
}

export interface Course {
  subject: string;
  school?: School;
  major?: string | undefined;
  subjectCode?: string | undefined;
  unit?: number;
  target_students_from?: stringOrUndefined;
  target_year?: stringOrUndefined;
  quarter?: Quarter;
}


type School = 
'KED'| //基幹・大学院基幹
'ISI'| //共創
'EDU'| //教育学部・教職課程
'LAW'| //法学
'ECO'| //経済
'MED'| //医学部医学科・医学部生命科学科・医学部保健学科
'DEN'| //歯
'PHS'| //薬
'ENG'| //工
'DES'| //芸工
'AGR'| //農
undefined;

export type numberOrUndefined = number | undefined;
export type stringOrUndefined = string | undefined;



export interface GradeEntry extends Course{ // GradeEntry should extend Course!! FIX THE INCONSISTENCY IN PROPERTY NAMES!!
  category?: CourseCategory,
  letter_evaluation?: LetterEvaluation,
  gpa?: number | undefined,
  year?: number | undefined,
  quarter?: Quarter,
  subject_number?: string | undefined, //"KED-KES1111J"
  course_id?: number | undefined,
  prinstructor?: string | undefined,
  last_updated?: Date | undefined;
}

export interface _PlannerTableEntry extends GradeEntry {
  isPlan: boolean;
  plan_entry_id: number; 
}

// need to fix the duplicate code between GradeEntry and Course
// FIGURE OUT THE RIGHT INHERITANCE STRUCTURE!!
export type PlannerTableEntry = _PlannerTableEntry | GradeEntry | Course;

export interface PlannerTable {
  [year: number]: [PlannerTableEntry[], PlannerTableEntry[]]; // [前期, 後期]
}

export interface GradeFilterOptions {
  quarter?: number;
  year?: number;
  evaluation?: LetterEvaluation;
  category?: string;
}

export type CourseCategory = string | undefined; 
export type LetterEvaluation = 'S' | 'A' | 'B' | 'C' | 'D' | 'F' | 'W' | 'R' | '' | undefined; // change this to enum and get rid of gpa?
export type Quarter = '前期' | '前' | '夏学期' | '前期集中' | '春学期' | '後期' | '後' | '秋学期' | '後期集中' | '冬学期' | '通年' | undefined;
