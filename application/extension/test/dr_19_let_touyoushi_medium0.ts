import type { DegreeRequirementBase, Req, LeafReq } from "@qcampusmate-mate/types"

const dr: DegreeRequirementBase = {
  "meta": {
    "enrollment": 2019,
    "school": "LET",
    "major": "歴史学コース",
    "field": "東洋史学",
    "lang1st": "Korean",
    "lang2nd": "English",
    "isItrntnlStd": true,
    "provData": true
  },
  "req": {
    "keg": {
      "label": "基幹教育",
      "minUnit": 48,
      "children": [
        {
          "label": "基幹教育セミナー",
          "elecComp": 3,
          "major": "KES",
          "minUnit": 1,
          "matchOptions": {
            "mustHas": {
              "courses": [
                {
                  "subject": "基幹教育セミナー",
                  "school": "KED",
                  "major": "KES",
                  "subjectCode": "1111J",
                  "unit": 1
                }
              ]
            }
          }
        },
        {
          "label": "言語文化基礎科目",
          "major": "LCB",
          "minUnit": 12,
          "children": [
            {
              "label": "韓国語",
              "elecComp": 2,
              "major": "LCB",
              "minUnit": 7,
              "matchOptions": {
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
            },
            {
              "label": "英語",
              "elecComp": 2,
              "major": "LCB",
              "minUnit": 5,
              "matchOptions": {
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
            }
          ]
        },
        {
          "label": "文系ディシプリン科目",
          "major": "HSS",
          "minUnit": 10,
          "children": [
            {
              "label": "選択必修①",
              "elecComp": 2,
              "major": "HSS",
              "minUnit": 8,
              "matchOptions": {
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
            },
            {
              "label": "選択必修②",
              "elecComp": 2,
              "major": "HSS",
              "minUnit": 2,
              "matchOptions": {
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
            }
          ]
        },
        
      ]
    },
    "school": {
      "label": "専攻教育科目",
      "minUnit": 80,
      "children": [
        {
          "label": "文学部コア科目",
          "minUnit": 9,
          "children": [
            {
              "label": "人文学科共通科目",
              "elecComp": 2,
              "minUnit": 4,
              "matchOptions": {
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
            },
            {
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
                  "elecComp": 2,
                  "major": "HUM",
                  "minUnit": 1,
                  "matchOptions": {
                    "include": {
                      "majors": [
                        "HUM"
                      ],
                      "like": "[中国語|英語|古典語|ドイツ語|朝鮮語|アラビア語]"
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  }
}

export default dr 