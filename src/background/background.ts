import openTab from '../utils/openDRC'
import { updatePlannerTables } from '../utils/sync' 

/*global chrome */
/*eslint no-undef: "error"*/
const color = '#3aa757'

chrome.runtime.onInstalled.addListener(() => {
  // chrome.action.setBadgeText({
  //   text: "OFF",
  // })
  const DRCTree = {a: 1}
  const AP = [1, 2, 3]
  const PlannerTables = [] //: PlannerTable[]
  const currAP: number = 0;
  chrome.storage.local.set({ DRCTree, AP, PlannerTables, currAP}, function () {
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