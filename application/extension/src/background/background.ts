import type { StudentInfo, GradeEntry, CampusmateCourseResults } from '@qcampusmate-mate/types'
import CourseRecordDTO from '../utils/courseRecordDTO'
import openDRCWindow from '../utils/openDRC'
import randomizedGPAndLE from '../utils/random_grade'
import { saveStudentInfo, saveImportedGradeRecord } from '../utils/sync' 
import DR_LET from '../../test/dr/dr_19_let_touyoushi_large0.json' 

/*global chrome */
/*eslint no-undef: "error"*/
const color = '#3aa757'

chrome.runtime.onInstalled.addListener(() => {
  // chrome.action.setBadgeText({
  //   text: "OFF",
  // })
  const DRCTree = null;
  const DR = DR_LET;
  const studentInfo: StudentInfo = {
      enrollment: 2020,
      school: '', 
      major: '',
      field: '',
      lang1st: '',
      lang2nd: '',
      isItrntnlStd: false,
      provData: false
  }
  
  const records_all: GradeEntry[] = []
  const maxYearInAp: number = 0
  chrome.storage.local.set({ DRCTree, DR, studentInfo, records_all, maxYearInAp }, function () {
    console.log("in background.ts, onInstalled: setting DRCTree & AP's initial value")
  })
})

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    
    switch(request.msg) {
      case "hello":
        sendResponse({ farewell: "goodbye" })
      break
      case "gpaDataImported": 
        chrome.action.setBadgeBackgroundColor({color: [0, 255, 0, 0]},  // Green
          () => { 
            sendResponse({ code: 200 })
          },
        );
      break
      case "saveStudentInfo":
        saveStudentInfo(request.data, () => {
          console.log("in service worker, event::saveStudentInfo: successfully saved studentInfo")
        })
        sendResponse({ code: 200})
      break
      case "saveImportedGradeRecords": 
        (() => new Promise((resolve, reject) => {
          try {
            chrome.storage.local.get('isRandomized', ({isRandomized}) => {
              const courseResults = request.data as CampusmateCourseResults
              const courseRecordDTOs = courseResults.course_grades.map(c => new CourseRecordDTO(c))

              courseResults.course_grades = isRandomized ? courseRecordDTOs.map(c => randomizedGPAndLE(c)) : courseRecordDTOs
              
              console.info('@service worker event::saveImportedGradeRecords, has CourseResults: ⏬')
              console.log(courseResults)
              resolve(courseResults) 
            })
          } catch {
            reject('@service worker event::saveImportedGradeRecords, error when trying to create randomized grade')
          }
        }))()
        .then(res => saveImportedGradeRecord(res as CampusmateCourseResults))
        .then(() => {console.log('in service worker, event::saveImportedGradeRecords: successfully saved imported grade records')})
        .catch(e => { console.error(e)})
      break
      case "openDRC":
        openDRCWindow()
        sendResponse({ code: 200 })
      break
      case "putDRCTree":
        /** Not Implemented */
      break
      default:
        throw Error("ERR!! in service worker, received unknown event!!")
    }
  }
);

// /**
//  * TODO
//  * sync user settings to indexDB
//  */
// function saveStudentProfile(profile: any): boolean {
//   // on message "SAVE_PROFILE"
//   let isIdentical = true
//   if (isIdentical) {
//     fetchDR(profile)
//   }
//   return true
// }

// /** save loaded grade to DB
//  * @param {Object} grade_record
//  */
// function saveGradeRecord(grade_record: any): boolean {
//   // on message "SAVE_GRADE"
//   return true
// }

// /** 
//  * Fetch degree-requirement and save to DB
//  */
// function fetchDR(studentProfile: any): boolean {
//   // fetch()
//   return true
// }