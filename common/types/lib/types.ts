import { SCHOOL, LETTER_EVALUATION, QUARTER } from './Constants' 
import { StudentInfo } from './StudentInfo' 
import { Course, GradeEntry } from './Course'

export interface DegreeRequirementBase {
  meta: StudentInfo;
  req: Req[];
 }

interface Req extends _Req {
  school: SCHOOL;
  minFirstYear?: number 
}

// 葉要件
export interface LeafReq extends _Req{
  major: string | string[] | undefined;
  matchOptions: MatchOptions;
}

// A minimal tree structure for consistency with Element Plus UI
interface _Req {
  label: string;
  minUnit: number;
  children?: _Req[];
  elecComp?: 1 | 2 | 3 ;
}

export interface MatchOptions {
  mustHas?: MustHasOptions; 
  include?: ExIncludeOptions; 
  exclude?: ExIncludeOptions; 
}

interface MustHasOptions {
  courses?: Course[]; // priority=1
  majors?: string[];
  like?: RegExp; // priority=2
}

interface ExIncludeOptions {
  like?: RegExp;
  courses?: Course[];
  schools?: SCHOOL[];
  majors?: string[];
}


export interface GradeFilterOptions {
  quarter?: number;
  year?: number;
  evaluation?: LETTER_EVALUATION;
  category?: string;
}
