/* This files provides utility functions for synchronization between data in the view model and client storage*/
/* Execution context is expected to be in a Service Worker context */
import { PlannerTable, GradeEntry, StudentInfo} from '@qcampusmate-mate/types'
import { filterBy, setDRCTreeNodeProperties } from '../drc/DRC'

/** (Think about potential validations needed upon saving..)
 *  Save <currAP> along side
 */
export function savePlannerTable(plannerTable: PlannerTable, currAP: number) {

  chrome.storage.local.get(['PlannerTables'], ({PlannerTables}) => {
    PlannerTables[currAP] = plannerTable
  })
  chrome.storage.local.set({PlannerTables: plannerTable, currAP}, () => {
    chrome.storage.local.get(['PlannerTables', 'currAP'], ({PlannerTables, currAP}) => {
      console.log(`in sync.ts, savePlannerTable(): saved PlannerTables, count: ${PlannerTables.length}, currAP: ${currAP}`)
    })
  })
}

/**
 * Update stored planner tables when course grades are imported. If neccessary, merge imported course grade entries and existing planned course entries.
 * Reference: notion...
 * @param course_grades 
 */
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
      // console.log(JSON.stringify(PlannerTables))
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

export function saveDRCTree(serializedTree: string, cb: (data?: any) => void) {
  chrome.storage.local.set({ DRCTree: serializedTree }, () => {
    cb(serializedTree)
  })
}

export function saveStudentInfo(studentInfo: StudentInfo, cb: (data?: any) => void) {
  chrome.storage.local.set({ studentInfo }, () => {
    console.log('in sync.ts, saveStudentInfo(): saved studentInfo')
    cb()
  })
}

/**
 * gpaData is of following type
 * 
 * {
    tHeadNameMap: tHeadNameMapping,
    categories: [],
    course_grades: [],
    } 
 * 
 *   
 */
export function saveImportedGradeRecord(GPAData) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set({ 
        GPADATA: GPAData, 
        records_all: JSON.stringify((GPAData.course_grades as GradeEntry[])
        .map(ge => setDRCTreeNodeProperties(ge)))
      }, 
        () => { 
          // console.log(JSON.stringify((GPAData.course_grades as GradeEntry[]).map(ge => setDRCTreeNodeProperties(ge))), null, 2)
          resolve(GPAData.course_grades.length)
        }
      )
    } catch {
      reject()
    }
  })
}