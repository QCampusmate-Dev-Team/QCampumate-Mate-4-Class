import { GradeEntry, LETTER_EVALUATION, QUARTER, SCHOOL,CampusmateCourseRecord } from "@qcampusmate-mate/types";
// import { isNumber } from "lodash";

export default class CourseRecordDTO implements GradeEntry {
  label: string; // the name of the GradeEntry, also the rendered text in DRCTree
  subject: string;
  category: string;
  school: SCHOOL
  major: string;
  unit: number;
  letter_evaluation: LETTER_EVALUATION;
  gp: number | '*';
  year: number;
  quarter: QUARTER;
  numberlink: string;
  course_id: number;
  prinstructor: string;
  last_updated: string | Date;
  
  constructor(courseRecordRaw: CampusmateCourseRecord) {
    const { category, subject, unit, letter_evaluation, gp, year, quarter, numberlink, course_id, prinstructor, last_updated} = 
    courseRecordRaw

    this.subject = subject
    this.label = subject
    this.major = categoryToMajor(category)
    this.school = categoryToSchool(category) as SCHOOL
    this.category = category
    this.unit = !parseFloat(unit) ? null : parseFloat(unit)
    this.gp = parseFloat(gp)
    this.letter_evaluation = toHalfSize(letter_evaluation) as LETTER_EVALUATION
    this.year = parseInt(year)
    this.quarter = quarter as QUARTER
    this.numberlink = numberlink
    this.course_id = parseInt(course_id)
    this.last_updated = last_updated
    this.prinstructor = prinstructor
  } 
}

function toHalfSize(str: string): string {
  if (str.length == 1) return String.fromCharCode(str.charCodeAt(0) - 65248);
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