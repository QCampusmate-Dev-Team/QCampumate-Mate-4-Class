/** TODO: 
 *    Can consider this is done✅, tho did in a different way. But keep this 
 *    for education purposes. 
 *    1. Make CourseGradeEntry implements GradeEntry 
 *    2. Separate the randomization algorithm into another file as ESModule(gp randomization is needed elsewhere than exporting the grade)
 *  　
 *  Reference:
 *    https://blog.holyblue.jp/entry/2022/07/10/182137 
 */
import { CampusmateCourseRecord, CampusmateCourseResults } from '@qcampusmate-mate/types'
import * as XLSX from 'xlsx';

export const loadTranscript = async (isRandomized: boolean) => {
  console.log("Loading...")
  // Get reference to current tab (page)
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Programmatically inject a script and execute it on current tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: load,
    args: [isRandomized]
  });
}

export const exportTranscript = () => {
  // Get reference to current tab (page)
  chrome.storage.local.get(['GPADATA'], function (result) {
    // console.log(result.GPADATA);
    xlsxExportSave(result.GPADATA);
  });
}

export const exportTranscriptJSON = () => {
  chrome.storage.local.get(['GPADATA'], function (result) {
    console.log(result.GPADATA);
    const json = JSON.stringify(result.GPADATA, null, 2);
    // console.log(json);
    var blob1 = new Blob([json], { type: "text/plain;charset=utf-8" });

    const link = window.URL.createObjectURL(blob1);
    console.log('Object\'s url is', link);
    const a = document.createElement('a');
    a.download = "grade_report.json";
    a.href = link;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}

/**
 * 
 * This is a content script to load the grade into client-side storage
 * @param { isRandomized } Boolean - whether to randomize the grade
 */
function load(isRandomized: boolean) {
  var table, tBody, rows;
  try{
    table = document.querySelector('table.list') as HTMLTableElement,
    tBody = table.tBodies[0],
    rows = Array.from(tBody.rows)
    if (!(tBody) || !(rows) || !(rows[0].children && rows[0].children.length === 10)) {
      throw new Error('Cannot find the table')
    }
  } catch (e) {
    // If the page is not campusmate? Give a feedback like: you have to go to the course result page to load the data!!
    console.error(e)
    alert('成績情報が検知されていません。Campusmate-J 成績情報ページに移動してください。→ https://ku-portal.kyushu-u.ac.jp/campusweb/wssrlstr.do')
    return
  }

  const tHeadNameMapping = {},
    theadNames = ['subject', 'unit', 'letter_evaluation', 'gp', 'year', 'quarter', 'numberlink', 'course_id', 'prinstructor', 'last_updated'];

  // Use first row to set the name mapping(en => jp)
  [...rows[0].children].map(td => td.textContent).forEach((text, idx) => { tHeadNameMapping[theadNames[idx]] = text; });

  // the data structure representing a transcript(aka. grade_report)
  const GPAData: CampusmateCourseResults = {
    tHeadNameMap: tHeadNameMapping,
    categories: [],
    course_grades: [],
  };

  var category = "" 

  console.log('Randomized: ', isRandomized ? 'Yes' : 'No');
  // fill the empty DS with grade data
 
  for (let i = 1; i < rows.length; i++) {
    // console.log(i)
    if (rows[i].className === 'column_even') {
      if (rows[i+1].className === 'column_odd') { // New category
        category = rows[i].cells[0].textContent.trim();
        GPAData.categories.push(category); 
      }
    } else if (rows[i].className === 'column_odd') {
      let courseRecord = {}// new CourseGradeEntry()
      courseRecord['category'] = category;

      // for each row, generate a CourseGradeEntry
      [...rows[i].cells].forEach((item, index) => {
        courseRecord[theadNames[index]] = item.textContent.trim()
      });

      (GPAData.course_grades as CampusmateCourseRecord[]).push(courseRecord as CampusmateCourseRecord)
    } 
  }

  console.log(JSON.stringify(GPAData.course_grades, null, 2))
  chrome.runtime.sendMessage({msg: "saveImportedGradeRecords", data: GPAData, isRandom: isRandomized})

  chrome.storage.local.set({ GPADATA: GPAData }, function() {
    console.log('GPADATA is set.');
    alert("成績データをインポートできました！履修プラナーを開けます。")
  });
}

/**
 * TODO: comment this function
 * @param gpaData 
 */
function xlsxExportSave(gpaData) {
  const nameMap = gpaData.tHeadNameMap,
    categories = gpaData.categories,
    course_grades = gpaData.course_grades,
    first = nameMap['subject'];

  nameMap['category'] = '分野系列名／科目名';
  var filename = 'grade_report.xlsx',
    data = [{ [first]: course_grades[0]['category'] }],
    reKeys = obj => {
      const keyValues = Object.keys(obj)
        .map(k => {
          const newKey = nameMap[k] || k;
          return { [newKey]: obj[k] }
        });
      // console.log(Object.assign({}, ...keyValues));
      return Object.assign({}, ...keyValues);
    }

  course_grades.forEach((e, i, arr) => {
    data.push(reKeys(e));
    if (arr[i + 1] && arr[i]['category'] != arr[i + 1]['category']) {
      data.push({ [first]: arr[i + 1]['category'] });
    }
  })

  var ws = XLSX.utils.json_to_sheet(data);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "成績表");
  XLSX.writeFile(wb, filename);
}