import openTab from '../utils/openDRC'
import { DRC } from '../drc/DRC'
import { updatePlannerTables, saveDRCTree, saveStudentInfo} from '../utils/sync' 
import { StudentInfo } from '../../lib/types'
import dr from '../../locals/dr_mock.json'

/*global chrome */
/*eslint no-undef: "error"*/
const color = '#3aa757'

chrome.runtime.onInstalled.addListener(() => {
  // chrome.action.setBadgeText({
  //   text: "OFF",
  // })
  const DRCTree = null;
  const DR = dr;
  const PlannerTables = [] //: PlannerTable[]
  const currAP: number = 0;
  const studentInfo: StudentInfo = {
      enrollment: '',
      school: '', 
      major: '',
      field: '',
      lang1st: '',
      lang2nd: '',
      isItrntnlStd: false,
      provData: false
  }
  
  chrome.storage.local.set({ DRCTree, DR, PlannerTables, currAP, studentInfo}, function () {
    console.log(`in background.ts, onInstalled: setting DR ${JSON.stringify(DR, null, 2)}`)
    console.log("Setting DRCTree & AP's initial value")
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
      case "fetchTree":
        console.log('fetching DRCTree from indexedDB')
        sendResponse({ tree: "drcTree", grade: [1, 2, 3] })
      break
      case "openDRC":
        console.log("")
        openTab()
        sendResponse({ code: 200 })
      break
      case "updatePlannerTable":
        if(!request.data) {
          throw Error("in service worker, event::updatePlannerTable: request.data is undefined")
        }
        console.log("in service worker, event::updatePlannerTable: request received")
        updatePlannerTables(request.data)
        sendResponse({ code: 200 })
      break
      case "putDRCTree":
        chrome.storage.local.get(['GPADATA', 'DR'], ({ GPADATA, DR }) => {
          if (GPADATA && DR) {
            console.log('in background.ts, putDRCTree: generating DRCTree')
            const drc = new DRC().initializeRequirementTree(DR, GPADATA)
            const drcTree = drc.dumpDRCTree()
            saveDRCTree(drcTree /* as DRCTree */, (setTree) => {
              sendResponse({code:200})
              console.log("in service worker, event::saveDRCTree: successfully saved DRCTree", setTree)
            })
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