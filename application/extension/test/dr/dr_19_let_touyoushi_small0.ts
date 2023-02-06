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