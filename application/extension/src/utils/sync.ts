/* This files provides utility functions for synchronization between data in the view model and client storage*/
/* Execution context is expected to be in a Service Worker context */
import { PlannerTable, GradeEntry, StudentInfo, CampusmateCourseResults } from '@qcampusmate-mate/types'
import { filterBy, setStatusInRecordsAll, getMaxYearInRecords } from '../drc/DRC'
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
 * Save grade record imported from campusmate and set the ``
 *   
 */
export function saveImportedGradeRecord(GPAData: CampusmateCourseResults) {
  return new Promise((resolve, reject) => {
    try {
      const processedCoureseRecords = (JSON.parse(JSON.stringify((GPAData.course_grades))) as GradeEntry[])
      .map(ge => setStatusInRecordsAll(ge))
      
      console.log(JSON.stringify(processedCoureseRecords, null, 2))

      chrome.storage.local.set({ 
        GPADATA: GPAData, 
        records_all: JSON.stringify(processedCoureseRecords),
        maxYearInAp: getMaxYearInRecords(processedCoureseRecords)
      }, 
      () => {
        resolve(GPAData.course_grades.length)
      })
    } catch {
      reject()
    }
  })
}