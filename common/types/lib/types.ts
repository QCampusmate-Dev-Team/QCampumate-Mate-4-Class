import type { ComputedRef } from 'vue'
import type { SCHOOL, LETTER_EVALUATION, QUARTER } from './Constants' 
import type { StudentInfo } from './StudentInfo' 
import type { Course } from './Course'
import type { CompiledLeafReqInterface } from './DRC'

export interface DegreeRequirementBase {
  meta?: StudentInfo;
  req: {
    keg: Req,
    school: Req
  }
 }

export interface Tree {
  label: string
  children?: Tree[]
}

// 非葉要件
// Represents a requirement node in 
// A minimal tree structure for consistency with Element Plus UI
/**
 * elecComp: 
 * ================
 *  3 : 必修
 *  2 : 選択必修
 *  1 : 専攻教育自由選択
 *  0 : 基幹教育>その他
 * -1 : 未定  
 * ================
 */
export interface Req extends Tree {
  minUnit: number;
  category?: string | string[] | undefined;
  major?: string | string[] | undefined;
  passed_units?: number | ComputedRef<number>;
  minFirstYear?: number;
  elecComp?: -1 | 0 | 1 | 2 | 3; 
  children?: (Req | LeafReq)[] | CompiledLeafReqInterface[]
}
// 
// 葉要件
export interface LeafReq extends Req{
  matchOptions: MatchOptions;
}


export interface MatchOptions {
  mustHas?: MustHasOptions; 
  include?: ExIncludeOptions; 
  exclude?: ExIncludeOptions; 
}

interface MustHasOptions {
  courses?: Course[]; // priority=1
  majors?: string[];
  like?: RegExp | string; // priority=2
}

interface ExIncludeOptions {
  like?: RegExp | string;
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
