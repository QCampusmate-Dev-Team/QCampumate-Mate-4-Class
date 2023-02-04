import { expect, it } from 'vitest'
import type { ComputedRef } from 'vue'
import { toRaw, reactive} from 'vue'
import * as _ from 'lodash' 
import { DRC, CompiledLeafReq, sumUnits, reportDRCTreeNode} from '../src/drc/DRC'
import type { DegreeRequirementBase, StudentInfo, LeafReq, Req, GradeEntry } from '@qcampusmate-mate/types'
import dr_19_let_touyoushi_mid from './dr_19_let_touyoushi_medium0'
import { course_grades as let_ge_complete } from './grade_entry/grade_entry_large01.json'

describe('test DRC.categorize() should render "drcTree" correctly', () => {
  let drc: DRC
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

  beforeEach(() => {
    drc = new DRC()
  })

  it('test exact, underflow, overflow and disjointedness', () => {
    drc.drcTree = _.cloneDeep(dr_19_let_touyoushi_mid)
    drc.records_all.value = let_ge_complete as GradeEntry[]
    drc.pickLeafRequirements()
    drc.setUpPassedUnitsDeps()
    // actively calling for recomputed the "drcTree"
    drc.categorize() 

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