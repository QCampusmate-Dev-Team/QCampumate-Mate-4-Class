import type { ComputedRef } from 'vue'
import { expect, it, beforeAll } from 'vitest'
import { toRaw, reactive} from 'vue'
import _ from 'lodash' 
import { DRC, CompiledLeafReq, sumUnits, reportDRCTreeNode} from '../src/drc/DRC'
import { DegreeRequirementBase, StudentInfo, LeafReq, Req, GradeEntry } from '@qcampusmate-mate/types'
import dr_19_let_touyoushi_mid from './dr_19_let_touyoushi_medium0'
import dr_19_let_touyoushi_complete from './dr/dr_19_let_touyoushi_large0.json'
import { course_grades as let_ge_complete } from './grade_entry/grade_entry_large01.json'


function initializeDRC(drcInstance: DRC, dr?: DegreeRequirementBase, grade_records?: GradeEntry[]) {
  drcInstance.drcTree = _.cloneDeep(dr)
  drcInstance.records_all.value = grade_records as GradeEntry[]
  drcInstance.pickLeafRequirements()
  drcInstance.setUpPassedUnitsDeps()
  drcInstance.categorize() 
}

let drc:DRC = new DRC()
let postOrder: number[]


describe('test DRC.categorize() works for (2019, 文学部, 東洋史, 韓国語, 英語)', () => {
  initializeDRC(drc, dr_19_let_touyoushi_complete as DegreeRequirementBase, let_ge_complete as GradeEntry[])

  const combinations = [] // N * (N - 1) / 2
  for (let i = 0; i < drc.drLeaves.length; i++) {
    let A = drc.drLeaves[i]
    for (let j = i+1; j < drc.drLeaves.length; j++) {
      let B = drc.drLeaves[j]
      combinations.push([A, B, true])
    }
  }

  test.each(combinations)(
    'test anyOf::[%s] is not in [%s]',
    (A, B, expected) => {
    // Check: every element of A is not in B
      expect(A.children.every(
        (a: GradeEntry) => B.children.every(
          (b: GradeEntry) => !_.isEqual(b, a)
        )
      )).toBe(expected)
  })

  // console.log(drc.drLeaves.map(e => reportDRCTreeNode(e)).join('\n'))

  initializeDRC(drc, dr_19_let_touyoushi_complete as DegreeRequirementBase, let_ge_complete as GradeEntry[])
  test('every grade entry is matched', () => {
    console.log(_.differenceWith(drc.records_all.value, drc.matchedEntry, _.isEqual))
    expect(drc.matchedEntryCount).toStrictEqual(drc.recordsCount)
  })
})


describe.todo('test DRC.categorize() should render "drcTree" correctly', () => {
  let drc:DRC = new DRC()
  let postOrder: number[]
  function traverse(tree) {
    // if child is a leaf node, skip
    // else 
    if (!('matchFunction' in tree)) {
      for (const child of tree.children) {
        traverse(child as Req)
      }
      postOrder.push((tree.passed_units as ComputedRef<number>)?.value)
    }
  }

  it.todo('test exact, underflow, overflow and disjointedness', () => {
    drc.drcTree = _.cloneDeep(dr_19_let_touyoushi_mid)
    drc.records_all.value = let_ge_complete as GradeEntry[]

    // actively calling for recomputed the "drcTree"
    

    const ans = []
    postOrder = []
    // for (const [key, req] of Object.entries(drc.drcTree.req)) {
    //   traverse(req)
    // }

    // console.log(drc.drLeaves.map(e => reportDRCTreeNode(e)).join('\n'))
    console.log(JSON.stringify(reactive(drc.drcTree), null, 2))
    expect(postOrder).toEqual(ans)
  })

})