import type { Course, GradeEntry } from './course'
import type { Tree } from './degReq'
import type { LETTER_EVALUATION } from './constants'
import type { ComputedRef, UnwrapNestedRefs } from 'vue'

export interface _PlannerTableEntry extends GradeEntry {
  isPlan: boolean;
  plan_entry_id: number; 
}

// need to fix the duplicate code between GradeEntry and Course
// FIGURE OUT THE RIGHT INHERITANCE STRUCTURE!!
export type PlannerTableEntry = _PlannerTableEntry | GradeEntry | Course;

export interface PlannerTable {
  // e.g. 2019 => [前期授業[], 後期授業[]]
  [year: number]: [PlannerTableEntry[], PlannerTableEntry[]]; 
}

export type MatchFunctionType = (g: GradeEntry) => Boolean

export interface CompiledLeafReqInterface extends Tree {
  label: string;
  minUnit: number;
  matchFunction: MatchFunctionType;
  children: UnwrapNestedRefs<GradeEntry[]>;
  minFirstYear?: number;
  passed_units: ComputedRef<number>;
  elecComp?: -1 | 0 | 1 | 2 | 3; 
}

export interface GradeFilterOptions {
  quarter?: number;
  year?: number;
  evaluation?: LETTER_EVALUATION;
  category?: string;
}