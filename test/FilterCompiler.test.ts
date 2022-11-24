import { compile } from '../src/drc/FilterCompiler'
import { expect, it } from 'vitest'
import { GradeEntry, MatchOptions} from '../lib/types'

describe('must has one course', () => {
  const matchKisemiMustHasCourses:MatchOptions = {
    mustHas: {
      courses: [
        {
          subjectName: '基幹教育セミナー',
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
    const testFn = compile(matchKisemiMustHasCourses)
    expect(G0_Empty).toHaveLength(0)
    expect(G0_Empty.map((e: GradeEntry) => testFn(e))).toEqual([])
  })

  it('mustHas 基幹教育セミナー (matchOpt: Course[], in 1 grade entries)', () => {
    const testFn = compile(matchKisemiMustHasCourses)
    expect(G1_only_kisemi_0).toHaveLength(1)
    expect(G1_only_kisemi_0.map((e: GradeEntry) => testFn(e))).toEqual([true])
    expect(G1_only_kyougaku_1.map((e: GradeEntry) => testFn(e))).toEqual([false])
  })

  it('mustHas 基幹教育セミナー (matchOpt: Course[], in 2 grade entries)', () => {
    const testFn = compile(matchKisemiMustHasCourses)
    const G2_0_local = [...G2_0];
    expect(G2_0_local).toHaveLength(2)
    expect(G2_0_local.map((e: GradeEntry) => testFn(e))).toEqual([true, false])
    expect(G2_0_local.reverse().map((e: GradeEntry) => testFn(e))).toEqual([false, true])
  })

  it('mustHas 基幹教育セミナー (matchOpt: Course[], in 5 grade entries)', () => {
    const testFn = compile(matchKisemiMustHasCourses)
    const G5_0_local = Array.from(G5_0);
    expect(G5_0_local).toHaveLength(5)
    expect(G5_0_local.map((e: GradeEntry) => testFn(e))).toEqual([false, true, false, false, false])
    expect(G5_0_local.reverse().map((e: GradeEntry) => testFn(e))).toEqual([false, false, false, true, false])
  })

  it('mustHas 課題協学科目 (matchOpt: like, in 0 grade entries)', () => {
    const testFn = compile(matchColearnMustHasLike)
    expect(G0_Empty).toHaveLength(0)
    expect(G0_Empty.map((e: GradeEntry) => testFn(e))).toEqual([])
  })

  it('mustHas 課題協学科目 (matchOpt: like, in 1 grade entry', () => {
    const testFn = compile(matchColearnMustHasLike)
    expect(G1_only_kisemi_0).toHaveLength(1)
    expect(G1_only_kyougaku_1).toHaveLength(1)
    expect(G1_only_kisemi_0.map((e: GradeEntry) => testFn(e))).toEqual([false])
    expect(G1_only_kyougaku_1.map((e: GradeEntry) => testFn(e))).toEqual([true])
  })

  it('mustHas 課題協学科目 (matchOpt: like, in 5 grade entry', () => {
    const testFn = compile(matchColearnMustHasLike)
    const G5_0_local = Array.from(G5_0);

    expect(G5_0_local).toHaveLength(5)
    expect(G5_0_local.map((e: GradeEntry) => testFn(e))).toEqual([false, false, false, false, true])
    expect(G5_0_local.reverse().map((e: GradeEntry) => testFn(e))).toEqual([true, false, false, false, false])
  })
})

describe("include multiple courses", () => {
  const matchKoreanIncludeCourses:MatchOptions = {
    include: {
      courses:[
        {
          subjectName: '韓国語Ⅰ',
          school: 'KED',
          major: 'LCB',
          subjectCode: '1611J',
          unit: 1
        },
        {
          subjectName: '韓国語Ⅱ',
          school: 'KED',
          major: 'LCB',
          subjectCode: '1612J',
          unit: 1
        },
        {
          subjectName: '韓国語Ⅱ',
          school: 'KED',
          major: 'LCB',
          subjectCode: '1612J',
          unit: 1
        },
        {
          subjectName: '韓国語Ⅲ',
          school: 'KED',
          major: 'LCB',
          subjectCode: '2611J',
          unit: 1
        },
        {
          subjectName: '韓国語Ⅳ',
          school: 'KED',
          major: 'LCB',
          subjectCode: '2612J',
          unit: 1
        },
        {
          subjectName: '韓国語表現演習Ⅰ',
          school: 'KED',
          major: 'LCB',
          subjectCode: '2613J',
          unit: 1
        },
        {
          subjectName: '韓国語表現演習Ⅱ',
          school: 'KED',
          major: 'LCB',
          subjectCode: '2614J',
          unit: 1
        }
      ]
    }
  }

  const matchSougouIncludeMajors:MatchOptions = {
    include: {
      majors: ['GES']
    }
  }

  it('include 韓国語 (matchOpt: Course[], in 0 grade entries)', () => {
    const testFn = compile(matchKoreanIncludeCourses)
    expect(G0_Empty).toHaveLength(0)
    expect(G0_Empty.map((e: GradeEntry) => testFn(e))).toEqual([])
  })

  it('include 韓国語 (matchOpt: Course[], in 1 grade entry)', () => {
    const testFn = compile(matchKoreanIncludeCourses)
    expect(G1_only_korean).toHaveLength(1)
    expect(G1_only_korean.map((e: GradeEntry) => testFn(e))).toEqual([true])
    expect(G1_only_kyougaku_1.map((e: GradeEntry) => testFn(e))).toEqual([false])
  })

  it('include 韓国語 (matchOpt: Course[], in 2 grade entries)', () => {
    const testFn = compile(matchKoreanIncludeCourses)
    const G2_0_local = [...G2_0];
    expect(G2_0_local).toHaveLength(2)
    expect(G2_0_local.map((e: GradeEntry) => testFn(e))).toEqual([false, true])
    expect(G2_0_local.reverse().map((e: GradeEntry) => testFn(e))).toEqual([true, false])
  })

  it('include 韓国語 (matchOpt: Course[], in 5 grade entries)', () => {
    const testFn = compile(matchKoreanIncludeCourses)
    const G5_0_local = Array.from(G5_0);
    expect(G5_0_local).toHaveLength(5)
    expect(G5_0_local.map((e: GradeEntry) => testFn(e))).toEqual([false, false, true, true, false])
    expect(G5_0_local.reverse().map((e: GradeEntry) => testFn(e))).toEqual([false, true, true, false, false])
  })

  it('include 韓国語, match all true(matchOpt: Course[], in 5 grade entries)', () => {
    const testFn = compile(matchKoreanIncludeCourses)
    const G5_all_korean_1_local = Array.from(G5_all_korean_1);
    expect(G5_all_korean_1_local).toHaveLength(5)
    expect(G5_all_korean_1_local.map((e: GradeEntry) => testFn(e))).toEqual([true, true, true, true, true])
    expect(G5_all_korean_1_local.reverse().map((e: GradeEntry) => testFn(e))).toEqual([true, true, true, true, true])
  })

  it("include 総合科目 (matchOpt: majors:[GES], in 10 grade entries)", () => {
    const testFn = compile(matchSougouIncludeMajors)
    const G10_some_GES_0_local = [...G10_some_GES_0]

    expect(G10_some_GES_0_local).toHaveLength(10)
    expect(G10_some_GES_0.map((e: GradeEntry) => testFn(e))).toEqual([false, false, true, true, true, true, true, true, true, false])
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
    const testFn = compile(matchSougouIncludeMajors)
    const G10_some_GES_0_local = [...G10_some_GES_0]
    const G10_some_SCIKIKAN_1_local = [...G10_some_SCIKIKAN_1]
    expect(G10_some_GES_0_local).toHaveLength(10)
    expect(G10_some_GES_0.map((e: GradeEntry) => testFn(e))).toEqual([false, false, false, false, false, false, false, false, false, false])
    expect(G10_some_GES_0.reverse().map((e: GradeEntry) => testFn(e))).toEqual([false, false, false, false, false, false, false, false, false, false])

    expect(G10_some_SCIKIKAN_1_local).toHaveLength(10)
    expect(G10_some_SCIKIKAN_1_local.map((e: GradeEntry) => testFn(e))).toEqual([false, false, true, true, true, true, true, true, false, false])
    expect(G10_some_SCIKIKAN_1_local.reverse().map((e: GradeEntry) => testFn(e))).toEqual([false, false, true, true, true, true, true, true, false, false])
  })
})

describe.todo("exclude and include multiple courses", () => {
  // Setup
  const matchTouyoushiExcludeLike: MatchOptions = {
    include: {
      majors: ['HUM'],
      like:new RegExp(/[日本史学|朝鮮史学|朝鮮歴史文化論|考古学|ヨーロッパ史学|イスラム史学]/)
    },
    exclude: {
      majors: ['HUM'],
      like: new RegExp(/東洋史学/)
    }
  }

  it("exclude 東洋史学 (matchOpt: majors:[HUM], like: 東洋史学, in 5 grade entries)", () => { 
    const testFn = compile(matchTouyoushiExcludeLike) 

    const G5_some_history_2_local = [...G5_some_history_2] 

    expect(G5_some_history_2_local).toHaveLength(5)
    expect(G5_some_history_2_local.map((e: GradeEntry) => testFn(e))).toEqual([false, false, false, false, true])
    expect(G5_some_history_2_local.reverse().map((e: GradeEntry) => testFn(e))).toEqual([true, false, false, false, false])
  })

  // Assertion 
})


describe.todo("test combinations", () => {

})

describe.todo("test all", () => {
 it("文学部 東洋史 古典語および外国語科目", () => {})

 it("文学部 歴史コース 東洋史 コース共通科目", () => {})

 it("文学部 東洋史　専門分野科目")
})

const G0_Empty: GradeEntry[] = []
const G1_only_kisemi_0: GradeEntry[] = [
  {
    category: '基幹教育セミナー',
    subject: '基幹教育セミナー',
    unit: 1,
    year: 2020,
    subject_number: 'KED-KES1111J'
  }
]
const G1_only_kyougaku_1: GradeEntry[] = [
  {
    category: '課題協学科目',
    subject: '課題協学科目',
    unit: 2.5,
    year: 2020,
    subject_number: ''
  }
]
const G1_only_korean: GradeEntry[] = [
  {
    category: '言語文化基礎科目',
    subject: '韓国語Ⅰ',
    unit: 1,
    year: 2019,
    subject_number: 'KED-LCB1611J'
  }
]
const G2_0: GradeEntry[] = [
  {
    category: '基幹教育セミナー',
    subject: '基幹教育セミナー',
    unit: 1,
    year: 2020,
    subject_number: 'KED-KES1111J'
  },
  {
    category: '言語文化基礎科目',
    subject: '韓国語Ⅱ',
    unit: 1,
    year: 2019,
    subject_number: 'KED-LCB1612J'
  }
]

// contains 課題協学科目 and 基幹教育セミナー
const G5_0: GradeEntry[] = [
  {
    category: '基幹教育セミナー',
    subject: '基幹教育セミナー',
    unit: 1,
    year: 2020,
    subject_number: 'KED-KES1101J'
  },
  {
    category: '基幹教育セミナー',
    subject: '基幹教育セミナー',
    unit: 1,
    year: 2020,
    subject_number: 'KED-KES1111J'
  },
  {
    category: '言語文化基礎科目',
    subject: '韓国語Ⅱ',
    unit: 1,
    year: 2019,
    subject_number: 'KED-LCB1612J'
  },
  {
    category: '言語文化基礎科目',
    subject: '韓国語Ⅱ',
    unit: 1,
    year: 2020,
    subject_number: 'KED-LCB1612J'
  },
  {
    category: '課題協学科目',
    subject: '課題協学科目',
    unit: 2.5,
    year: 2020,
    subject_number: ''
  }
]

const G5_all_korean_1: GradeEntry[] = [
  {
    category: '言語文化基礎科目',
    subject: '韓国語Ⅰ',
    unit: 1,
    year: 2019,
    subject_number: 'KED-LCB1611J'
  },
  {
    category: '言語文化基礎科目',
    subject: '韓国語Ⅱ',
    unit: 1,
    year: 2019,
    subject_number: 'KED-LCB1612J'
  },
  {
    category: '言語文化基礎科目',
    subject: '韓国語Ⅱ',
    unit: 1,
    year: 2020,
    subject_number: 'KED-LCB1612J'
  },
  {
    category: '言語文化基礎科目',
    subject: '韓国語Ⅱ',
    unit: 1,
    year: 2020,
    subject_number: 'KED-LCB1612J'
  },
  {
    category: '言語文化基礎科目',
    subject: '韓国語Ⅲ',
    unit: 1,
    year: 2021,
    subject_number: 'KED-LCB2611J'
  }
]
// contains 3 東洋史, 1 史学概論, 1 ヨーロッパ史学
const G5_some_history_2: GradeEntry[] = [
  {
    category: '（文）専攻教育科目',
    subject: '東洋史学講義Ⅰ',
    unit: 2,
    year: 2021,
    subject_number: 'LET-HUM2341J'
  },
  {
    category: '（文）専攻教育科目',
    subject: '史学概論',
    unit: 2,
    year: 2021,
    subject_number: 'LET-HUM2301J'
  },
  {
    category: '（文）専攻教育科目',
    subject: '東洋史学講義Ⅱ',
    unit: 2,
    year: 2021,
    subject_number: 'LET-HUM3341J'
  },
  {
    category: '（文）専攻教育科目',
    subject: '東洋史学講義ⅩⅠ',
    unit: 2,
    year: 2021,
    subject_number: 'LET-HUM4344J'
  },
  {
    category: '（文）専攻教育科目',
    subject: 'ヨーロッパ史学講義Ⅶ',
    unit: 2,
    year: 2021,
    subject_number: ''
  }
]

const G10_some_GES_0: GradeEntry[] = [
  {
    category: '基幹教育セミナー',
    subject: '基幹教育セミナー',
    unit: 1,
    year: 2020,
    subject_number: 'KED-KES1111J'
  },
  {
    category: '健康・スポーツ科目',
    subject: '健康・スポーツ科学演習',
    unit: 1,
    year: 2019,
    subject_number: 'KED-HSP1211J'
  },
  {
    category: '総合科目',
    subject: 'ソフトウェア技術を利用した創造的サービス構築論Ⅰ',
    unit: 1,
    year: 2020,
    subject_number: 'KED-GES1221J'
  },
  {
    category: '総合科目',
    subject: '企業と創るアイディアソン・ハッカソン演習',
    unit: 1,
    year: 2022,
    subject_number: 'KED-GES1241J'
  },
  {
    category: 'フロンティア科目',
    subject: 'サイバーセキュリティ演習',
    unit: 1,
    year: 2020,
    subject_number: 'KED-GES1160J'
  },
  {
    category: 'フロンティア科目',
    subject: '九州大学の歴史Ⅰ',
    unit: 1,
    year: 2020,
    subject_number: 'KED-GES1186J'
  },
  {
    category: 'フロンティア科目',
    subject: '九州大学の歴史Ⅱ',
    unit: 1,
    year: 2020,
    subject_number: 'KED-GES1187J'
  },
  {
    category: 'フロンティア科目',
    subject: '伊都キャンパスを科学する I （軌跡編）',
    unit: 1,
    year: 2019,
    subject_number: 'KED-GES1197J'
  },
  {
    category: 'フロンティア科目',
    subject: '伊都キャンパスを科学する II （現在編）',
    unit: 1,
    year: 2019,
    subject_number: 'KED-GES1198J'
  },
  {
    category: '高年次基幹教育科目',
    subject: '機械学習と人工知能',
    year: 2022,
    subject_number: 'KED-ASC2191J'
  }
]

const G10_some_SCIKIKAN_1: GradeEntry[] = [
  {
    category: '文系ディシプリン科目',
    subject: '現代教育学入門',
    unit: 1,
    year: 2019,
    subject_number: 'KED-HSS1341J'
  },
  {
    category: '文系ディシプリン科目',
    subject: '教育基礎学入門',
    unit: 1,
    year: 2019,
    subject_number: 'KED-HSS1351J'
  },
  {
    category: '理系ディシプリン科目',
    subject: '社会と数理科学',
    unit: 1,
    year: 2020,
    subject_number: 'KED-SMA1011J'
  },
  {
    category: '理系ディシプリン科目',
    subject: '線形代数学・同演習Ａ',
    unit: 1.5,
    year: 2020,
    subject_number: 'KED-SMA1221J'
  },
  {
    category: '理系ディシプリン科目',
    subject: '数理統計学',
    unit: 1.5,
    year: 2020,
    subject_number: 'KED-SMA2411J'
  },
  {
    category: '理系ディシプリン科目',
    subject: '身の回りの物理学Ａ',
    unit: 1,
    year: 2021,
    subject_number: 'KED-SPH1021J'
  },
  {
    category: '理系ディシプリン科目',
    subject: '身の回りの物理学Ｂ',
    unit: 1,
    year: 2021,
    subject_number: 'KED-SPH1022J'
  },
  {
    category: '理系ディシプリン科目',
    subject: '生命の科学Ａ',
    unit: 1,
    year: 2019,
    subject_number: 'KED-SBI1011J'
  },
  {
    category: '（理）専攻教育科目',
    subject: '数学基礎Ⅱ',
    unit: 2,
    year: 2021,
    subject_number: 'SCI-MAT1120J'
  },
  {
    category: '（理）専攻教育科目',
    subject: 'データベース・情報検索',
    unit: 2,
    year: 2021,
    subject_number: 'SCI-INF3571J'
  }
]


