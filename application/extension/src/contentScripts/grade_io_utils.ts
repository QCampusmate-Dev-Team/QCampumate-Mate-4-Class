/** TODO: 
 *    1. Make CourseGradeEntry implements GradeEntry
 *    2. Separate the randomization algorithm into another file as ESModule(gpa randomization is needed elsewhere than exporting the grade)
 * 
 *  Reference:
 *    https://blog.holyblue.jp/entry/2022/07/10/182137 
 */
import { LETTER_EVALUATION, QUARTER, stringOrUndefined } from '@qcampusmate-mate/types'
import * as XLSX from 'xlsx';

// import GPAData from "../../locals/grade_report.json";

function exportData(gpaData) {
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

export const loadTranscript = async (isRandomized: boolean) => {
  console.log("Loading...")
  // Get reference to current tab (page)
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // If the page is not campusmate? Give a feedback like: you have to go to the course result page to load the data!!

  // Programmatically inject a script and execute it on current tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: load,
    args: [isRandomized]
  });
}

export const exportTranscript = () => {
  console.log("Exporting...")
  // Get reference to current tab (page)
  chrome.storage.local.get(['GPADATA'], function (result) {
    // console.log(result.GPADATA);
    exportData(result.GPADATA);
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
    // XLSX.writeFile(result.GPADATA, 'grade_report.json');
  });
}

/**
 * TODO:
 *  - infer school from category, and add a school field to each grade entry 
 * 
 * This is a content script to load the grade into client-side storage
 * @param { isRandomized } Boolean - whether to randomize the grade
 */
function load(isRandomized: boolean) {
  /////////Randomization Utilities/////////

  function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  }

  const rand_grade = function() {
    const rand = randn_bm();
    var gp;
    if(rand > -0.3 && rand < 0.3) {
      gp = 3;
    } else if (rand > -1.2 && rand <= -0.3 || rand >= 0.3 && rand < 1.2){
      gp = 4;
    } else if (rand > -2 && rand <= -1.2 || rand >= 1.2 && rand < 2) {
      gp = 2; 
    } else if (rand > -2.5 && rand <= -2 || rand >= 2 && rand < 2.5) {
      gp = 1;
    } else {
      gp = 0
    }
    return gp;
  }
  
  function gp_to_letter(gp) {
    const MAP = {0: 'F', 1: 'D', 2: 'C', 3:'B', 4: 'A'};
    return MAP[gp];
  }
  ////////////////////////////////////////

  function toHalfSize(str){
    if (str.length == 1) return String.fromCharCode(str.charCodeAt(0) - 65248);
    // throw new Error(`toHalfSize: str.length !== 1, str=${str}`);
  }

  ////// Data Structure for holding a course's gpa and its administrative information

  // implements GradeEntry
  // class CourseGradeEntry  {
  //   category: string;
  //   subject: string;
  //   unit: numberOrUndefined;
  //   letter_evaluation: LETTER_EVALUATION;
  //   gpa: numberOrUndefined;
  //   year: numberOrUndefined;
  //   quarter: QUARTER;
  //   subject_number: stringOrUndefined;
  //   course_id: numberOrUndefined;
  //   prinstructor: stringOrUndefined;
  //   last_updated: Date | undefined;

    // constructor(category='', subject='', unit=undefined, letter_evaluation: LETTER_EVALUATION='', gpa=undefined, year=undefined, quarter=undefined, subject_number=undefined, course_id=undefined, prinstructor='', last_updated=undefined) {
    //   this.category = category;
    //   this.subject = subject;
    //   this.unit = unit;
    //   this.letter_evaluation = letter_evaluation; // = { A, B, C, D, F, R }
    //   this.gpa = gpa; // This might not be a number
    //   this.year = year;
    //   this.quarter = quarter;
    //   this.subject_number = subject_number;
    //   this.course_id = course_id;
    //   this.prinstructor = prinstructor;
    //   this.last_updated = last_updated;
    // }
  // }

  interface GradeEntry {
    subject: string;
    status?: number;
    school?: string;
    major?: stringOrUndefined;
    subjectCode?: stringOrUndefined;
    unit?: number;
    category?: string;
    letter_evaluation?: LETTER_EVALUATION;
    gpa?: number | undefined;
    year?: number | undefined;
    quarter?: QUARTER;
    numberlink?: stringOrUndefined; //"KED-KES1111J"
    course_id?: number | undefined;
    prinstructor?: stringOrUndefined;
    last_updated?: Date | string | undefined;
  }

  
  var table, tBody, rows;
  try{
    table = document.querySelector('table.list') as HTMLTableElement,
    tBody = table.tBodies[0],
    rows = Array.from(tBody.rows);
    if (!(tBody) || !(rows) || !(rows[0].children && rows[0].children.length === 10)) {
      throw new Error('Cannot find the table');
    }
  } catch (e) {
    console.error(e)
    alert('成績情報が検知されていません。成績情報ページに移動してください。→ https://ku-portal.kyushu-u.ac.jp/campusweb/wssrlstr.do');
    return;
  }
  // console.log(rows[0].children.length === 10);

  const tHeadNameMapping = {},
    theadNames = ['subject', 'unit', 'letter_evaluation', 'gpa', 'year', 'quarter', 'numberlink', 'course_id', 'prinstructor', 'last_updated'];

  // Use first row to set the name mapping(en => jp)
  [...rows[0].children].map(td => td.textContent).forEach((text, idx) => { tHeadNameMapping[theadNames[idx]] = text; });

  // the data structure representing a transcript(aka. grade_report)
  const GPAData = {
    tHeadNameMap: tHeadNameMapping,
    categories: [],
    course_grades: [],
  };

  var category = "" 

  function categoryToSchool(category: string): string | undefined {
    const categoriesMap = [
      [['基幹教育セミナー', '課題協学科目', '言語文化基礎科目', '文系ディシプリン科目', '理系ディシプリン科目', '健康・スポーツ科目', '総合科目', 'フロンティア科目', '高年次基幹教育科目', 'サイバーセキュリティ科目', ], 'KED'],
      [['（文）専攻教育科目', '（文）低年次専攻教育科目'], 'LET'],
      [['（経）専攻教育科目', ], 'ECO'],
      [['（理）専攻教育科目', ], 'SCI'],
      [['（工）専攻教育科目', ], 'ENG'],
      [['（農）コース必修科目', '農）コース選択必修科目', '（農）分野選択必修科目', '（農）分野選択必修科目・実験', '（農）コース概要科目', '（農）共通基礎科目'], 'AGR'], 
    ]

    for (const [cats, school] of categoriesMap) {
      if ((cats as string[]).some(c => c === category)) {
        return school as string
      }
    }
  }
  
  function categoryToMajor(category: string): string | undefined {
    const categoriesMap = [
      [['基幹教育セミナー'], 'KES'],
      [['課題協学科目'], 'ICL'],
      [['言語文化基礎科目'], 'LCB'],  
      [['文系ディシプリン科目'], 'HSS'],    
      [['健康・スポーツ科目'], 'HSP'],  
      [['総合科目', 'フロンティア科目'], 'GES'],  
      [['高年次基幹教育科目'], 'ASC'],  
      [['サイバーセキュリティ科目'], 'CSC'], 
      [['（文）専攻教育科目', '（文）低年次専攻教育科目'], 'HUM']
    ]

    for (const [cats, major] of categoriesMap) {
      if ((cats as string[]).some(c => c === category)) {
        return major as string
      }
    }
  }
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
      let courseRecord = {} as GradeEntry // new CourseGradeEntry()
      courseRecord['category'] = category;
      courseRecord['school'] = categoryToSchool(category);
      courseRecord['major'] = categoryToMajor(category);
      // for each row, generate a CourseGradeEntry
      [...rows[i].cells].forEach((item, index) => {
        // convert all non-empty gp string to half-size
        if (index === 3) { // GP
          let gp:string = item.textContent.trim()
          if (!Number.isNaN(parseFloat(gp))) { // if gp is a number
            let gpa:number = isRandomized ? rand_grade() : parseFloat(gp);
            courseRecord[theadNames[index]] = gpa;
            courseRecord['letter_evaluation'] = gp_to_letter(gpa);
          } else { // if gp is empty or non-number representation
            courseRecord[theadNames[index]] = NaN; // gpa=undefined
          }
        } 
        else if (index === 2 && item.textContent.trim()) { 
          // for non empty letter evaluation, convert to half-size
          courseRecord[theadNames[index]] = toHalfSize(item.textContent.trim())
        } else if (index === 9) { // 最終更新日
          const s = item.textContent.trim()
          courseRecord[theadNames[index]] = s //? new Date(s) : ''
        } else { // non (GP, letter evaluation, 最終更新日) fields
          const s = item.textContent.trim()
          courseRecord[theadNames[index]] = !Number.isNaN(parseFloat(s)) ?  parseFloat(s) : s 
        }
      })
      GPAData.course_grades.push(courseRecord)
    } 
  }

  console.log(JSON.stringify(GPAData.course_grades.slice(0, 10), null, 2))
  chrome.runtime.sendMessage({msg: "saveImportedGradeRecords", data: GPAData})

  chrome.storage.local.set({ GPADATA: GPAData }, function() {
    console.log('GPADATA is set.');
    alert("成績データをインポートできました！履修プラナーを開けます。")
  });
}
