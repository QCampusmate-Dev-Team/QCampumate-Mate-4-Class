import openTab from '../utils/openDRC'
import { saveStudentInfo, saveImportedGradeRecord } from '../utils/sync' 
import { StudentInfo, GradeEntry } from '@qcampusmate-mate/types'
import DR_LET from '../fixtures/dr_mock.json'
// import { DR_LET } from '@qcampusmate-mate/fixtures'

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
        console.log("saveImportedGradeRecords")
        saveImportedGradeRecord(request.data)
        .then(() => {console.log('in service worker, event::saveImportedGradeRecords: successfully saved imported grade records')})
        .catch(e => { console.error(e)})
      break
      case "openDRC":
        console.log("")
        openTab()
        sendResponse({ code: 200 })
      break
      case "putDRCTree":
        chrome.storage.local.get(['GPADATA', 'DR'], ({ GPADATA, DR }) => {
          if (GPADATA && DR) {
            // console.log('in background.ts, putDRCTree: generating DRCTree')
            // const drc = new DRC().initializeRequirementTree(DR, GPADATA)
            // const drcTree = drc.dumpDRCTree()
            // saveDRCTree(drcTree /* as DRCTree */, (setTree) => {
            //   sendResponse({code:200})
            //   console.log("in service worker, event::putDRCTree: successfully saved DRCTree", setTree)
            // })
          } else {
            throw Error("ERR! in service worker, event::putDRCTree: unable to retrieve GPADATA or DR")
          }
        })
      break
      default:
        throw Error("ERR!! in service worker, received unknown event!!")
    }
  }
);

// /** 
//  * sync user settings with PouchDB
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