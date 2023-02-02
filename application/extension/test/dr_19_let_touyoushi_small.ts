import type { DegreeRequirementBase, StudentInfo, LeafReq, Req } from '@qcampusmate-mate/types'

const student: StudentInfo = {
  "enrollment": 2019,
  "school": "LET",
  "major": "歴史学コース",
  "field": "東洋史学",
  "lang1st": "Korean",
  "lang2nd": "English",
  "isItrntnlStd": true,
  "provData": true
} 



const kikan_seminar: LeafReq = {
  label: '基幹セミナー',
  minUnit: 1,
  elecComp: 3,
  major: 'KES',
  matchOptions: {
    mustHas: {
      courses: [
        {
          subject: '基幹教育セミナー',
          school: 'KED',
          major: 'KES',
          subjectCode: '1111J',
          unit: 1,
        }
      ]
    }
  }
}

const kyoutsu: Req = {
  label: '共通',
  minUnit: 2,
  elecComp: 3,
  children: [
    {
      label: '基礎',
      minUnit: 2,
      elecComp: 3,
      matchOptions: {
        mustHas: {
          courses: [
            {
              subject: '',
              school: 'LET',
              major: 'HUM',
              subjectCode: '1111J',
              unit: 2,
            }
          ]
        }
      }
    }
  ]
}

const kikan: Req = {
  label: '基幹教育',
  minUnit: 48,
  children: [
    kikan_seminar
  ]
}

const school_req: Req = {
  label: '専攻教育科目',
  minUnit: 0,
  children: [
    kyoutsu
  ]
}

// const student1:StudentInfo = 
// const requirements = dr_19_let_touyoushi.req
const dr: DegreeRequirementBase = {
  meta: student,
  req: {
    keg: kikan,
    school: school_req
  }
}

export { dr as default } 
