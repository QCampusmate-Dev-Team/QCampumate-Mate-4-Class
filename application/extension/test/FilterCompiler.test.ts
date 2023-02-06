import { compileMatchOptions } from '../src/drc/FilterCompiler'
import { expect, it } from 'vitest'
import { GradeEntry, MatchFunctionType, MatchOptions} from '@qcampusmate-mate/types'
import * as _ from 'lodash'
// import { course_grades as let_ge_complete } from './grade_entry/course_result_let_touyoushi_large01.json'
import let_ge_complete from './grade_entry/grade_entry_let_touyoushi_large02.json'

describe('must has one course', () => {
  const matchKisemiMustHasCourses:MatchOptions = {
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

  const matchColearnMustHasLike:MatchOptions = {
    mustHas: {
      like: new RegExp('課題協学科目')
    }
  } 

  it('mustHas 基幹教育セミナー (matchOpt: Course[], in 0 grade entries)', () => {
    const matchFunc = compileMatchOptions(matchKisemiMustHasCourses)
    expect(G0_Empty).toHaveLength(0)
    expect(G0_Empty.map((e: GradeEntry) => matchFunc(e))).toEqual([])
  })

  it('mustHas 基幹教育セミナー (matchOpt: Course[], in 1 grade entries)', () => {
    const matchFunc = compileMatchOptions(matchKisemiMustHasCourses)
    expect(G1_only_kisemi_0).toHaveLength(1)
    expect(G1_only_kisemi_0.map((e: GradeEntry) => matchFunc(e))).toEqual([true])
    expect(G1_only_kyougaku_1.map((e: GradeEntry) => matchFunc(e))).toEqual([false])
  })

  it('mustHas 基幹教育セミナー (matchOpt: Course[], in 2 grade entries)', () => {
    const matchFunc = compileMatchOptions(matchKisemiMustHasCourses)
    const G2_0_local = [...G2_0];
    expect(G2_0_local).toHaveLength(2)
    expect(G2_0_local.map((e: GradeEntry) => matchFunc(e))).toEqual([true, false])
    expect(G2_0_local.reverse().map((e: GradeEntry) => matchFunc(e))).toEqual([false, true])
  })

  it('mustHas 基幹教育セミナー (matchOpt: Course[], in 5 grade entries)', () => {
    const matchFunc = compileMatchOptions(matchKisemiMustHasCourses)
    const G5_0_local = Array.from(G5_0);
    expect(G5_0_local).toHaveLength(5)
    expect(G5_0_local.map((e: GradeEntry) => matchFunc(e))).toEqual([false, true, false, false, false])
    expect(G5_0_local.reverse().map((e: GradeEntry) => matchFunc(e))).toEqual([false, false, false, true, false])
  })

  it('mustHas 課題協学科目 (matchOpt: like, in 0 grade entries)', () => {
    const matchFunc = compileMatchOptions(matchColearnMustHasLike)
    expect(G0_Empty).toHaveLength(0)
    expect(G0_Empty.map((e: GradeEntry) => matchFunc(e))).toEqual([])
  })

  it('mustHas 課題協学科目 (matchOpt: like, in 1 grade entry', () => {
    const matchFunc = compileMatchOptions(matchColearnMustHasLike)
    expect(G1_only_kisemi_0).toHaveLength(1)
    expect(G1_only_kyougaku_1).toHaveLength(1)
    expect(G1_only_kisemi_0.map((e: GradeEntry) => matchFunc(e))).toEqual([false])
    expect(G1_only_kyougaku_1.map((e: GradeEntry) => matchFunc(e))).toEqual([true])
  })

  it('mustHas 課題協学科目 (matchOpt: like, in 5 grade entry', () => {
    const matchFunc = compileMatchOptions(matchColearnMustHasLike)
    const G5_0_local = Array.from(G5_0);

    expect(G5_0_local).toHaveLength(5)
    expect(G5_0_local.map((e: GradeEntry) => matchFunc(e))).toEqual([false, false, false, false, true])
    expect(G5_0_local.reverse().map((e: GradeEntry) => matchFunc(e))).toEqual([true, false, false, false, false])
  })
})

describe("include multiple courses", () => {
  const matchKoreanIncludeCourses:MatchOptions = {
    include: {
      courses:[
        {
          subject: '韓国語Ⅰ',
          school: 'KED',
          major: 'LCB',
          subjectCode: '1611J',
          unit: 1
        },
        {
          subject: '韓国語Ⅱ',
          school: 'KED',
          major: 'LCB',
          subjectCode: '1612J',
          unit: 1
        },
        {
          subject: '韓国語Ⅱ',
          school: 'KED',
          major: 'LCB',
          subjectCode: '1612J',
          unit: 1
        },
        {
          subject: '韓国語Ⅲ',
          school: 'KED',
          major: 'LCB',
          subjectCode: '2611J',
          unit: 1
        },
        {
          subject: '韓国語Ⅳ',
          school: 'KED',
          major: 'LCB',
          subjectCode: '2612J',
          unit: 1
        },
        {
          subject: '韓国語表現演習Ⅰ',
          school: 'KED',
          major: 'LCB',
          subjectCode: '2613J',
          unit: 1
        },
        {
          subject: '韓国語表現演習Ⅱ',
          school: 'KED',
          major: 'LCB',
          subjectCode: '2614J',
          unit: 1
        }
      ]
    }
  }

  it('include 韓国語 (matchOpt: Course[], in 0 grade entries)', () => {
    const matchFunc = compileMatchOptions(matchKoreanIncludeCourses)
    expect(G0_Empty).toHaveLength(0)
    expect(G0_Empty.map((e: GradeEntry) => matchFunc(e))).toEqual([])
  })

  it('include 韓国語 (matchOpt: Course[], in 1 grade entry)', () => {
    const matchFunc = compileMatchOptions(matchKoreanIncludeCourses)
    expect(G1_only_korean).toHaveLength(1)
    expect(G1_only_korean.map((e: GradeEntry) => matchFunc(e))).toEqual([true])
    expect(G1_only_kyougaku_1.map((e: GradeEntry) => matchFunc(e))).toEqual([false])
  })

  it('include 韓国語 (matchOpt: Course[], in 2 grade entries)', () => {
    const matchFunc = compileMatchOptions(matchKoreanIncludeCourses)
    const G2_0_local = [...G2_0];
    expect(G2_0_local).toHaveLength(2)
    expect(G2_0_local.map((e: GradeEntry) => matchFunc(e))).toEqual([false, true])
    expect(G2_0_local.reverse().map((e: GradeEntry) => matchFunc(e))).toEqual([true, false])
  })

  it('include 韓国語 (matchOpt: Course[], in 5 grade entries)', () => {
    const matchFunc = compileMatchOptions(matchKoreanIncludeCourses)
    const G5_0_local = Array.from(G5_0);
    expect(G5_0_local).toHaveLength(5)
    expect(G5_0_local.map((e: GradeEntry) => matchFunc(e))).toEqual([false, false, true, true, false])
    expect(G5_0_local.reverse().map((e: GradeEntry) => matchFunc(e))).toEqual([false, true, true, false, false])
  })

  it('include 韓国語, match all true(matchOpt: Course[], in 5 grade entries)', () => {
    const matchFunc = compileMatchOptions(matchKoreanIncludeCourses)
    const G5_all_korean_1_local = Array.from(G5_all_korean_1);
    expect(G5_all_korean_1_local).toHaveLength(5)
    expect(G5_all_korean_1_local.map((e: GradeEntry) => matchFunc(e))).toEqual([true, true, true, true, true])
    expect(G5_all_korean_1_local.reverse().map((e: GradeEntry) => matchFunc(e))).toEqual([true, true, true, true, true])
  })

  const matchSougouIncludeMajors:MatchOptions = {
    include: {
      majors: ['GES']
    }
  }

  it("include 総合科目 (matchOpt: majors:[GES], in 10 grade entries)", () => {
    const matchFunc = compileMatchOptions(matchSougouIncludeMajors)
    const G10_some_GES_0_local = [...G10_some_GES_0]

    expect(G10_some_GES_0_local).toHaveLength(10)
    expect(G10_some_GES_0.map((e: GradeEntry) => matchFunc(e))).toEqual([false, false, true, true, true, true, true, true, true, false])
  })

  const matchKikanSciIncludeMajors:MatchOptions = {
    "include": {
      "majors": [
        "SMA",
        "SPH",
        "SCH",
        "SBI",
        "SGS",
        "SKD",
        "SIS",
        "SLE"
      ]
    }
  }

  it("include 理系ディシプリン科目 (matchOpt: majors: [SMA, SPH, SCH, SBI, SGS, SKD, SIS, SLE], in 20 grade entries)", () => {
    const matchFunc = compileMatchOptions(matchKikanSciIncludeMajors)
    const G10_some_GES_0_local = [...G10_some_GES_0]
    const G10_some_SCIKIKAN_1_local = [...G10_some_SCIKIKAN_1]
    // No courses in G10_some_GES_0_local includes any 理系ディシ科目
    expect(G10_some_GES_0_local).toHaveLength(10)
    expect(G10_some_GES_0.map((e: GradeEntry) => matchFunc(e))).toEqual([false, false, false, false, false, false, false, false, false, false])
    expect(G10_some_GES_0.reverse().map((e: GradeEntry) => matchFunc(e))).toEqual([false, false, false, false, false, false, false, false, false, false])


    expect(G10_some_SCIKIKAN_1_local).toHaveLength(10)
    expect(G10_some_SCIKIKAN_1_local.map((e: GradeEntry) => matchFunc(e))).toEqual([false, false, true, true, true, true, true, true, false, false])
    expect(G10_some_SCIKIKAN_1_local.reverse().map((e: GradeEntry) => matchFunc(e))).toEqual([false, false, true, true, true, true, true, true, false, false])
  })
})

describe("mastHas majors and like", () => {
  it ('mastHas major:["LET"], like: "東洋史学講義"', () => {
    const leaf = {
      "label": "東洋史学講義",
      "elecComp": 2,
      "category": "HUM",
      "minUnit": 10,
      "matchOptions": {
        "mustHas": {
          "majors": [
            "HUM"
          ],
          "like": "東洋史学講義"
        }
      }
    }

    const ge = _.cloneDeep(let_ge_complete) as Array<Partial<GradeEntry>>
    const matchFunc = compileMatchOptions(leaf.matchOptions)
    // console.log(ge.filter(e => matchFunc(e as GradeEntry)))
    expect(ge.filter(e => matchFunc(e as GradeEntry)).length).toStrictEqual(5)
  })
})

describe("exclude and include multiple courses", () => {
  // 卒業要件、東洋史学>コース共通
  const matchTouyoushiExcludeLike: MatchOptions =  {
    "mustHas": {
      "courses":[
        {
          "subject": "史学概論",
          "school": "LET",
          "major": "HUM",
          "subjectCode": "2301J",
          "unit": 2
        }
      ]
    },
    "include": {
      "majors": ["HUM"],
      "like": "日本史学|朝鮮史学|朝鮮歴史文化論|考古学|ヨーロッパ史学|イスラム史学"
    },
    "exclude": {
      "majors": [
        "HUM"
      ],
      "like": "東洋史学"
    }
  }

  it("文学部19>東洋史>コース共通", () => { 
    const matchFunc = compileMatchOptions(matchTouyoushiExcludeLike) 

    const G5_some_history_2_local = [...G5_some_history_2] 

    expect(G5_some_history_2_local).toHaveLength(5)
    expect(G5_some_history_2_local.map((e: GradeEntry) => matchFunc(e))).toEqual([false, true, false, false, true])
    expect(G5_some_history_2_local.reverse().map((e: GradeEntry) => matchFunc(e))).toEqual([true, false, false, true, false])
  })

})

describe.todo("mustHas.courses and include.courses", () => {
  it("")
})

describe("test all", () => {
  let ge: GradeEntry[]
  beforeEach(() => {
    ge = _.cloneDeep(let_ge_complete) as Array<GradeEntry>
  })

  it("第一外国語 韓国語", () => {

    const mo: MatchOptions = {
      "include": {
        "courses": [
          {
            "subject": "韓国語Ⅰ",
            "school": "KED",
            "major": "LCB",
            "subjectCode": "1611J",
            "unit": 1
          },
          {
            "subject": "韓国語Ⅱ",
            "school": "KED",
            "major": "LCB",
            "subjectCode": "1612J",
            "unit": 1
          },
          {
            "subject": "韓国語Ⅱ",
            "school": "KED",
            "major": "LCB",
            "subjectCode": "1612J",
            "unit": 1
          },
          {
            "subject": "韓国語Ⅲ",
            "school": "KED",
            "major": "LCB",
            "subjectCode": "2611J",
            "unit": 1
          },
          {
            "subject": "韓国語Ⅳ",
            "school": "KED",
            "major": "LCB",
            "subjectCode": "2612J",
            "unit": 1
          },
          {
            "subject": "韓国語表現演習Ⅰ",
            "school": "KED",
            "major": "LCB",
            "subjectCode": "2613J",
            "unit": 1
          },
          {
            "subject": "韓国語表現演習Ⅱ",
            "school": "KED",
            "major": "LCB",
            "subjectCode": "2614J",
            "unit": 1
          }
        ]
      }
    }
  
    const matchFunc = compileMatchOptions(mo)
    expect(ge.filter(e => matchFunc(e as GradeEntry)).length).toStrictEqual(6)
  })

  it("外国語 英語", () => {

    const mo: MatchOptions = {
      "mustHas": {
        "courses": [
          {
            "subject": "学術英語A・リセプション",
            "school": "KED",
            "major": "LCB",
            "subjectCode": "1151W",
            "unit": 1
          },
          {
            "subject": "学術英語A・プロダクション",
            "school": "KED",
            "major": "LCB",
            "subjectCode": "1152W",
            "unit": 1
          },
          {
            "subject": "学術英語B・インテグレイト",
            "school": "KED",
            "major": "LCB",
            "subjectCode": "1161W",
            "unit": 1
          },
          {
            "subject": "学術英語A・CALL",
            "school": "KED",
            "major": "LCB",
            "subjectCode": "1191J",
            "unit": 1
          },
          {
            "subject": "学術英語B・CALL",
            "school": "KED",
            "major": "LCB",
            "subjectCode": "1192J",
            "unit": 1
          }
        ]
      },
      "include": {
        "courses": [
          {
            "subject": "学術英語AB・再履修",
            "school": "KED",
            "major": "LCB",
            "subjectCode": "1171W",
            "unit": 1
          },
          {
            "subject": "学術英語Ｃ・テーマベース",
            "school": "KED",
            "major": "LCB",
            "subjectCode": "2112W",
            "unit": 1
          },
          {
            "subject": "学術英語Ｃ・スキルベース",
            "school": "KED",
            "major": "LCB",
            "subjectCode": "2123W",
            "unit": 1
          }
        ]
      }
    }
  
    const matchFunc = compileMatchOptions(mo)
    expect(ge.filter(e => matchFunc(e as GradeEntry)).length).toStrictEqual(8)
  })

  it("文系ディシプリン科目>選択必修①", () => {
    const mo: MatchOptions = {
      "include": {
        "courses": [
          {
            "subject": "哲学・思想入門",
            "school": "KED",
            "major": "HSS",
            "subjectCode": "1111J",
            "unit": 2
          },
          {
            "subject": "社会思想史",
            "school": "KED",
            "major": "HSS",
            "subjectCode": "1211J",
            "unit": 2
          },
          {
            "subject": "先史学入門",
            "school": "KED",
            "major": "HSS",
            "subjectCode": "1121J",
            "unit": 2
          },
          {
            "subject": "歴史学入門",
            "school": "KED",
            "major": "HSS",
            "subjectCode": "1131J",
            "unit": 2
          },
          {
            "subject": "文学・言語学入門",
            "school": "KED",
            "major": "HSS",
            "subjectCode": "1141J",
            "unit": 2
          },
          {
            "subject": "芸術学入門",
            "school": "KED",
            "major": "HSS",
            "subjectCode": "1151J",
            "unit": 2
          },
          {
            "subject": "文化人類学入門",
            "school": "KED",
            "major": "HSS",
            "subjectCode": "1221J",
            "unit": 2
          },
          {
            "subject": "地理学入門",
            "school": "KED",
            "major": "HSS",
            "subjectCode": "1231J",
            "unit": 2
          },
          {
            "subject": "社会学入門",
            "school": "KED",
            "major": "HSS",
            "subjectCode": "1241J",
            "unit": 2
          },
          {
            "subject": "心理学入門",
            "school": "KED",
            "major": "HSS",
            "subjectCode": "1311J",
            "unit": 2
          }
        ]
      }
    }

    const matchFunc = compileMatchOptions(mo)
    // console.log(ge.filter(e => matchFunc(e as GradeEntry)).map(e=>e.subject))
    expect(ge.filter(e => matchFunc(e as GradeEntry)).length).toStrictEqual(6)
    
  })

  it("文系ディシプリン科目>選択必修②", () => {
    const mo: MatchOptions = {
      "include": {
        "courses": [
          {
            "subject": "現代教育学入門",
            "school": "KED",
            "major": "HSS",
            "subjectCode": "1341J",
            "unit": 1
          },
          {
            "subject": "教育基礎学入門",
            "school": "KED",
            "major": "HSS",
            "subjectCode": "1351J",
            "unit": 1
          },
          {
            "subject": "法学入門",
            "school": "KED",
            "major": "HSS",
            "subjectCode": "1411J",
            "unit": 2
          },
          {
            "subject": "政治学入門",
            "school": "KED",
            "major": "HSS",
            "subjectCode": "1421J",
            "unit": 2
          },
          {
            "subject": "経済史入門",
            "school": "KED",
            "major": "HSS",
            "subjectCode": "1521J",
            "unit": 2
          },
          {
            "subject": "The Law and Politics of International Society",
            "school": "KED",
            "major": "HSS",
            "subjectCode": "1431E",
            "unit": 2
          }
        ]
      }
    }
    const matchFunc = compileMatchOptions(mo)
    // console.log(ge.filter(e => matchFunc(e as GradeEntry)).map(e=>e.subject))
    expect(ge.filter(e => matchFunc(e as GradeEntry)).length).toStrictEqual(4)
  })

  it("理系ディシプリン科目", () => {
    const mo: MatchOptions = {
      "include": {
        "majors": [
          "SMA",
          "SPH",
          "SCH",
          "SBI",
          "SGS",
          "SKD",
          "SIS",
          "SLE"
        ]
      }
    }
    const matchFunc = compileMatchOptions(mo)
    // console.log(ge.filter(e => matchFunc(e as GradeEntry)).map( ({ subject, school, major, numberlink }) => ({subject, school,major, numberlink })))
    expect(ge.filter(e => matchFunc(e as GradeEntry)).length).toStrictEqual(8)
  })

  it("健康・スポーツ科目", () => {
    const mo: MatchOptions = {
      "mustHas": {
        "courses": [
          {
            "subject": "健康・スポーツ科学演習",
            "school": "KED",
            "major": "HSP",
            "subjectCode": "1211J",
            "unit": 1
          }
        ]
      }
    }
    const matchFunc = compileMatchOptions(mo)
    // console.log(ge.filter(e => matchFunc(e as GradeEntry)).map( ({ subject, school, major, numberlink }) => ({subject, school,major, numberlink })))
    expect(ge.filter(e => matchFunc(e as GradeEntry)).length).toStrictEqual(1)
  })

  it("総合科目", () => {
    const mo: MatchOptions = {
      "include": {
        "majors": [
          "GES"
        ]
      }
    }
    const matchFunc = compileMatchOptions(mo)
    expect(ge.filter(e => matchFunc(e as GradeEntry)).length).toStrictEqual(7)
  })

  it("高年次基幹教育科目", () => {
    const mo: MatchOptions = {
      "include": {
        "majors": [
          "ASC",
          "ASD"
        ]
      }
    }
    const matchFunc = compileMatchOptions(mo)
    expect(ge.filter(e => matchFunc(e as GradeEntry)).length).toStrictEqual(2)
  })

  it("人文学科基礎科目", () => {
    const mo: MatchOptions = {
      "mustHas": {
        "courses": [
          {
            "subject": "人文学基礎Ⅰ",
            "school": "LET",
            "major": "HUM",
            "subjectCode": "1011J",
            "unit": 2
          },
          {
            "subject": "人文学基礎Ⅱ",
            "school": "LET",
            "major": "HUM",
            "subjectCode": "1012J",
            "unit": 2
          }
        ]
      }
    }
    const matchFunc = compileMatchOptions(mo)
    expect(ge.filter(e => matchFunc(e as GradeEntry)).length).toStrictEqual(3)
  })

  it("人文学科共通科目", () => {
    const mo: MatchOptions = {
      "include": {
        "courses": [
          {
            "subject": "人文学 I",
            "school": "LET",
            "major": "HUM",
            "subjectCode": "2011J",
            "unit": 2
          },
          {
            "subject": "人文学 II",
            "school": "LET",
            "major": "HUM",
            "subjectCode": "2012J",
            "unit": 2
          },
          {
            "subject": "人文学 III",
            "school": "LET",
            "major": "HUM",
            "subjectCode": "3011J",
            "unit": 2
          },
          {
            "subject": "人文学 IV",
            "school": "LET",
            "major": "HUM",
            "subjectCode": "3012J",
            "unit": 2
          }
        ]
      }
    }

    const matchFunc = compileMatchOptions(mo)
    expect(ge.filter(e => matchFunc(e as GradeEntry)).length).toStrictEqual(0)
  })

  it("コース共通科目", () => {
    const mo: MatchOptions = {
      "mustHas": {
        "courses":[
          {
            "subject": "史学概論",
            "school": "LET",
            "major": "HUM",
            "subjectCode": "2301J",
            "unit": 2
          }
        ]
      },
      "include": {
        "majors": ["HUM"],
        "like": "日本史学|朝鮮史学|朝鮮歴史文化論|考古学|ヨーロッパ史学|イスラム史学"
      },
      "exclude": {
        "majors": [
          "HUM"
        ],
        "like": "東洋史学"
      }
    }

    const matchFunc = compileMatchOptions(mo)
    expect(ge.filter(e => matchFunc(e as GradeEntry)).length).toStrictEqual(3)
  })


  describe("文学部19>東洋史>古典語および外国語科目", () => {
    const leaf = {
      "label": "古典語および外国語科目",
      "elecComp": 2,
      "major": "LET",
      "minUnit": 3,
      "children": [
        {
          "label": "中国語",
          "elecComp": 3,
          "major": "HUM",
          "minUnit": 1,
          "matchOptions": {
            "mustHas": {
              "majors": [
                "HUM"
              ],
              "like": "中国語"
            }
          }
        },
        {
          "label": "英語",
          "elecComp": 3,
          "major": "HUM",
          "minUnit": 1,
          "matchOptions": {
            "mustHas": {
              "majors": [
                "HUM"
              ],
              "like": "英語"
            }
          }
        },
        {
          "label": "その他",
          "elecComp": 3,
          "major": "HUM",
          "minUnit": 1,
          "matchOptions": {
            "include": {
              "majors": [
                "HUM"
              ],
              "like": "中国語|英語|ラテン語|ドイツ語|朝鮮語|アラビア語|漢文|ギリシヤ語"
            }
          }
        }
      ]
    }
    const ge = _.cloneDeep(let_ge_complete) as Array<Partial<GradeEntry>>

    it('中国語', () => {
      const matchFunc = compileMatchOptions(leaf.children[0].matchOptions)

      
      expect(ge.filter(e => matchFunc(e as GradeEntry)).length).toStrictEqual(1)
    })
    
    it('英語', () => {
      const matchFunc = compileMatchOptions(leaf.children[1].matchOptions)
      // console.log(ge.filter(e => matchFunc(e as GradeEntry)))
      expect(ge.filter(e => matchFunc(e as GradeEntry)).length).toStrictEqual(1)
    })

    it('その他', () => {
      const matchFunc = compileMatchOptions(leaf.children[2].matchOptions)
      // console.log(ge.filter(e => matchFunc(e as GradeEntry)))
      expect(ge.filter(e => matchFunc(e as GradeEntry)).length).toStrictEqual(3)
    })
  })

  it("自由選択", () => {
    const others: GradeEntry[] =  [{
      category: '（文）専攻教育科目',
      course_id: 20054103,
      gp: 4,
      label: '現代史入門Ⅰ',
      last_updated: '2020/10/12',
      letter_evaluation: 'A',
      major: 'HUM',
      numberlink: '',
      prinstructor: '国分　航士',
      quarter: '前',
      school: 'LET',
      status: 2,
      subject: '現代史入門Ⅰ',
      unit: 2,
      year: 2020,
      matched: false,
      id: 48
    },
    {
      category: '（経）専攻教育科目',
      course_id: 21170085,
      gp: 4,
      label: '経済工学演習①',
      last_updated: '2022/02/18',
      letter_evaluation: 'A',
      numberlink: '',
      prinstructor: '北原　知就',
      quarter: '通年',
      school: 'ECO',
      status: 2,
      subject: '経済工学演習①',
      unit: 4,
      year: 2021,
      matched: false,
      id: 70
    },
    {
      category: '（経）専攻教育科目',
      course_id: 20171103,
      gp: 4,
      label: 'マクロ経済学Ⅰ',
      last_updated: '2020/08/21',
      letter_evaluation: 'A',
      numberlink: '',
      prinstructor: '村尾　徹士',
      quarter: '前',
      school: 'ECO',
      status: 2,
      subject: 'マクロ経済学Ⅰ',
      unit: 2,
      year: 2020,
      matched: false,
      id: 71
    },
    {
      category: '（工）専攻教育科目',
      course_id: 20254209,
      gp: 2,
      label: 'コンピュータアーキテクチャⅠ',
      last_updated: '2020/09/01',
      letter_evaluation: 'C',
      numberlink: '',
      prinstructor: '久住　憲嗣',
      quarter: '夏学期',
      school: 'ENG',
      status: 2,
      subject: 'コンピュータアーキテクチャⅠ',
      unit: 2,
      year: 2020,
      matched: false,
      id: 79
    },
    {
      category: '（工）専攻教育科目',
      course_id: 22256002,
      gp: null,
      label: 'オペレーティングシステム',
      last_updated: '',
      letter_evaluation: '',
      numberlink: '',
      prinstructor: '',
      quarter: '後',
      school: 'ENG',
      status: 0,
      subject: 'オペレーティングシステム',
      year: 2022,
      matched: false,
      id: 80
    }]

    const 自由選択科目: MatchOptions = {
      "include": {
        "schools": [
          "LET",
          "ISI",
          "EDU",
          "LAW",
          "ECO",
          "SCI",
          "MED",
          "DEN",
          "PHS",
          "ENG",
          "DES",
          "AGR",
          "21P"
        ]
      },
      "exclude": {
        "schools": ["KED"]
      }
    }

    const matchFunc:MatchFunctionType = compileMatchOptions(自由選択科目)
    expect(others.filter(matchFunc).length).toStrictEqual(others.length)
  })
})

const G0_Empty: GradeEntry[] = []
const G1_only_kisemi_0: GradeEntry[] = [
  {
    category: '基幹教育セミナー',
    label: '基幹教育セミナー',
    subject: '基幹教育セミナー',
    unit: 1,
    year: 2020,
    numberlink: 'KED-KES1111J'
  }
]
const G1_only_kyougaku_1: GradeEntry[] = [
  {
    category: '課題協学科目',
    label: '課題協学科目',
    subject: '課題協学科目',
    unit: 2.5,
    year: 2020,
    numberlink: ''
  }
]
const G1_only_korean: GradeEntry[] = [
  {
    category: '言語文化基礎科目',
    label: '韓国語Ⅰ',
    subject: '韓国語Ⅰ',
    unit: 1,
    year: 2019,
    numberlink: 'KED-LCB1611J'
  }
]
const G2_0: GradeEntry[] = [
  {
    category: '基幹教育セミナー',
    label: '基幹教育セミナー',
    subject: '基幹教育セミナー',
    unit: 1,
    year: 2020,
    numberlink: 'KED-KES1111J'
  },
  {
    category: '言語文化基礎科目',
    label: '韓国語Ⅱ',
    subject: '韓国語Ⅱ',
    unit: 1,
    year: 2019,
    numberlink: 'KED-LCB1612J'
  }
]

// contains 課題協学科目 and 基幹教育セミナー
const G5_0: GradeEntry[] = [
  {
    category: '基幹教育セミナー',
    label: '基幹教育セミナー',
    subject: '基幹教育セミナー',
    unit: 1,
    year: 2020,
    numberlink: 'KED-KES1101J'
  },
  {
    category: '基幹教育セミナー',
    label: '基幹教育セミナー',
    subject: '基幹教育セミナー',
    unit: 1,
    year: 2020,
    numberlink: 'KED-KES1111J'
  },
  {
    category: '言語文化基礎科目',
    label: '韓国語Ⅱ',
    subject: '韓国語Ⅱ',
    unit: 1,
    year: 2019,
    numberlink: 'KED-LCB1612J'
  },
  {
    category: '言語文化基礎科目',
    label: '韓国語Ⅱ',
    subject: '韓国語Ⅱ',
    unit: 1,
    year: 2020,
    numberlink: 'KED-LCB1612J'
  },
  {
    category: '課題協学科目',
    label: '課題協学科目',
    subject: '課題協学科目',
    unit: 2.5,
    year: 2020,
    numberlink: ''
  }
]

const G5_all_korean_1: GradeEntry[] = [
  {
    category: '言語文化基礎科目',
    label: '韓国語Ⅰ',
    subject: '韓国語Ⅰ',
    unit: 1,
    year: 2019,
    numberlink: 'KED-LCB1611J'
  },
  {
    category: '言語文化基礎科目',
    label: '韓国語Ⅱ',
    subject: '韓国語Ⅱ',
    unit: 1,
    year: 2019,
    numberlink: 'KED-LCB1612J'
  },
  {
    category: '言語文化基礎科目',
    label: '韓国語Ⅱ',
    subject: '韓国語Ⅱ',
    unit: 1,
    year: 2020,
    numberlink: 'KED-LCB1612J'
  },
  {
    category: '言語文化基礎科目',
    label: '韓国語Ⅱ',
    subject: '韓国語Ⅱ',
    unit: 1,
    year: 2020,
    numberlink: 'KED-LCB1612J'
  },
  {
    category: '言語文化基礎科目',
    label: '韓国語Ⅲ',
    subject: '韓国語Ⅲ',
    unit: 1,
    year: 2021,
    numberlink: 'KED-LCB2611J'
  }
]
// contains 3 東洋史, 1 史学概論, 1 ヨーロッパ史学
const G5_some_history_2: GradeEntry[] = [
  {
    category: '（文）専攻教育科目',
    label: '東洋史学講義Ⅰ',
    subject: '東洋史学講義Ⅰ',
    unit: 2,
    year: 2021,
    numberlink: 'LET-HUM2341J'
  },
  {
    category: '（文）専攻教育科目',
    label: '史学概論',
    subject: '史学概論',
    unit: 2,
    year: 2021,
    numberlink: 'LET-HUM2301J'
  },
  {
    category: '（文）専攻教育科目',
    label: '東洋史学講義Ⅱ',
    subject: '東洋史学講義Ⅱ',
    unit: 2,
    year: 2021,
    numberlink: 'LET-HUM3341J'
  },
  {
    category: '（文）専攻教育科目',
    label: '東洋史学講義ⅩⅠ',
    subject: '東洋史学講義ⅩⅠ',
    unit: 2,
    year: 2021,
    numberlink: 'LET-HUM4344J'
  },
  {
    category: '（文）専攻教育科目',
    label: 'ヨーロッパ史学講義Ⅶ',
    subject: 'ヨーロッパ史学講義Ⅶ',
    unit: 2,
    year: 2021,
    numberlink: ''
  }
]

const G10_some_GES_0: GradeEntry[] = [
  {
    category: '基幹教育セミナー',
    label: '基幹教育セミナー',
    subject: '基幹教育セミナー',
    unit: 1,
    year: 2020,
    numberlink: 'KED-KES1111J'
  },
  {
    category: '健康・スポーツ科目',
    label: '健康・スポーツ科学演習',
    subject: '健康・スポーツ科学演習',
    unit: 1,
    year: 2019,
    numberlink: 'KED-HSP1211J'
  },
  {
    category: '総合科目',
    label: 'ソフトウェア技術を利用した創造的サービス構築論Ⅰ',
    subject: 'ソフトウェア技術を利用した創造的サービス構築論Ⅰ',
    unit: 1,
    year: 2020,
    numberlink: 'KED-GES1221J'
  },
  {
    category: '総合科目',
    label: '企業と創るアイディアソン・ハッカソン演習',
    subject: '企業と創るアイディアソン・ハッカソン演習',
    unit: 1,
    year: 2022,
    numberlink: 'KED-GES1241J'
  },
  {
    category: 'フロンティア科目',
    label: 'サイバーセキュリティ演習',
    subject: 'サイバーセキュリティ演習',
    unit: 1,
    year: 2020,
    numberlink: 'KED-GES1160J'
  },
  {
    category: 'フロンティア科目',
    label: '九州大学の歴史Ⅰ',
    subject: '九州大学の歴史Ⅰ',
    unit: 1,
    year: 2020,
    numberlink: 'KED-GES1186J'
  },
  {
    category: 'フロンティア科目',
    label: '九州大学の歴史Ⅱ',
    subject: '九州大学の歴史Ⅱ',
    unit: 1,
    year: 2020,
    numberlink: 'KED-GES1187J'
  },
  {
    category: 'フロンティア科目',
    label: '伊都キャンパスを科学する I （軌跡編）',
    subject: '伊都キャンパスを科学する I （軌跡編）',
    unit: 1,
    year: 2019,
    numberlink: 'KED-GES1197J'
  },
  {
    category: 'フロンティア科目',
    label: '伊都キャンパスを科学する II （現在編）',
    subject: '伊都キャンパスを科学する II （現在編）',
    unit: 1,
    year: 2019,
    numberlink: 'KED-GES1198J'
  },
  {
    category: '高年次基幹教育科目',
    label: '機械学習と人工知能',
    subject: '機械学習と人工知能',
    year: 2022,
    numberlink: 'KED-ASC2191J'
  }
]

const G10_some_SCIKIKAN_1: GradeEntry[] = [
  {
    category: '文系ディシプリン科目',
    label: '現代教育学入門',
    subject: '現代教育学入門',
    unit: 1,
    year: 2019,
    numberlink: 'KED-HSS1341J'
  },
  {
    category: '文系ディシプリン科目',
    label: '教育基礎学入門',
    subject: '教育基礎学入門',
    unit: 1,
    year: 2019,
    numberlink: 'KED-HSS1351J'
  },
  {
    category: '理系ディシプリン科目',
    label: '社会と数理科学',
    subject: '社会と数理科学',
    unit: 1,
    year: 2020,
    numberlink: 'KED-SMA1011J'
  },
  {
    category: '理系ディシプリン科目',
    label: '線形代数学・同演習Ａ',
    subject: '線形代数学・同演習Ａ',
    unit: 1.5,
    year: 2020,
    numberlink: 'KED-SMA1221J'
  },
  {
    category: '理系ディシプリン科目',
    label: '数理統計学',
    subject: '数理統計学',
    unit: 1.5,
    year: 2020,
    numberlink: 'KED-SMA2411J'
  },
  {
    category: '理系ディシプリン科目',
    label: '身の回りの物理学Ａ',
    subject: '身の回りの物理学Ａ',
    unit: 1,
    year: 2021,
    numberlink: 'KED-SPH1021J'
  },
  {
    category: '理系ディシプリン科目',
    label: '身の回りの物理学Ｂ',
    subject: '身の回りの物理学Ｂ',
    unit: 1,
    year: 2021,
    numberlink: 'KED-SPH1022J'
  },
  {
    category: '理系ディシプリン科目',
    label: '生命の科学Ａ',
    subject: '生命の科学Ａ',
    unit: 1,
    year: 2019,
    numberlink: 'KED-SBI1011J'
  },
  {
    category: '（理）専攻教育科目',
    label: '数学基礎Ⅱ',
    subject: '数学基礎Ⅱ',
    unit: 2,
    year: 2021,
    numberlink: 'SCI-MAT1120J'
  },
  {
    category: '（理）専攻教育科目',
    label: 'データベース・情報検索',
    subject: 'データベース・情報検索',
    unit: 2,
    year: 2021,
    numberlink: 'SCI-INF3571J'
  }
]
