/* This files provides functions for data synchronization */
/* Execution context is expected to be in a Service Worker context */

import { PlannerTable, GradeEntry } from '../../lib/types'
import { filterBy } from '../drc/DRC'

export function updatePlannerTables(course_grades: GradeEntry[]) {
  console.log("updatePlannerTables(course_grades: GradeEntry[]) is called")
  chrome.storage.local.get(['PlannerTables'], ({ PlannerTables }) => {
    if (PlannerTables.length === 0) {
      PlannerTables.push([])
    } 

    for (let i = 0; i < PlannerTables.length; i++)
        providePlannerTable(course_grades, PlannerTables, i)
    
    chrome.storage.local.set({ PlannerTables }, () => {
      console.log('Planner tables updated! length:', PlannerTables.length)
      console.log(JSON.stringify(PlannerTables))
    })
  })
}

export function providePlannerTable(course_grades: GradeEntry[], planner_tables:PlannerTable[], index: number) {
  const thisYear = new Date().getFullYear();

  const ENROLLMENT = 2019; // temp magic number

  const newPlannerTable: PlannerTable = {};
  for (let y = ENROLLMENT; y <= thisYear; y++) {
    const zenki = filterBy(course_grades, { quarter: 0, year: y });
    console.log(`${y} 前期:`, zenki)

    const kouki = filterBy(course_grades,{ quarter: 1, year: y });
    // console.log(zenki);
    newPlannerTable[y] = [zenki, kouki];
  }
  console.log("in sync.ts providePlannerTable():", newPlannerTable)
  planner_tables[index] = newPlannerTable;
}