/*global chrome */
/*eslint no-undef: "error"*/
const color = '#3aa757'

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color })
  console.log('Default background color set to %cgreen', `color: ${color}`)
})


/** 
 * sync user settings with PouchDB
 */
function saveStudentProfile(profile: any): boolean {
  // on message "SAVE_PROFILE"
  let isIdentical = true
  if (isIdentical) {
    fetchDR(profile)
  }
  return true
}

/** save loaded grade to DB
 * @param {Object} grade_record
 */
function saveGradeRecord(grade_record: any): boolean {
  // on message "SAVE_GRADE"
  return true
}

/** 
 * Fetch degree-requirement and save to DB
 */
function fetchDR(studentProfile: any): boolean {
  // fetch()
  return true
}