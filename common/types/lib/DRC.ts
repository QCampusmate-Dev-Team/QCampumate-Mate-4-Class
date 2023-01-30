import { Course, GradeEntry } from './Course'

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
