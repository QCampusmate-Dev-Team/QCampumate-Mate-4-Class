import type { DegreeRequirementBase, StudentInfo, LeafReq, Req } from '@qcampusmate-mate/types'
import { expect, it } from 'vitest'
import { DRC } from '../src/drc/DRC'
import { student } from '../src/fixtures/student_info_mock'
import dr_2019_let_touyoushi from '../src/fixtures/dr_2019_let_touyoushi.json'
import dr_19_let_touyoushi_sm from './dr_19_let_touyoushi_small'
// All subsets are disjoint
import dr_19_let_touyoushi_sm0 from './dr_19_let_touyoushi_small0'

let drc
// Union of all subsets is the original set
describe('test pickLeafRequirements', () => {
  beforeEach(() => {
    drc = new DRC()
  })

  describe('can pick correct number of leaves', () => {
    it('drLeaves(# = 2)', () => {
      drc.dr = dr_19_let_touyoushi_sm
      drc.pickLeafRequirements()
      expect(drc.dr).toBeTruthy()
      expect(drc.drLeaves.length).toEqual(2)
    })
  
    it('drLeaves(# = 5)', () => {
      drc.dr = dr_19_let_touyoushi_sm0
      drc.pickLeafRequirements()
      expect(drc.dr).toBeTruthy()
  
      expect(drc.drLeaves.length).toEqual(5)
    })
  })

  it('all MatchOptions on leaf nodes should be converted into Match Functions', () => {
    drc.dr = dr_19_let_touyoushi_sm0
    drc.pickLeafRequirements()
    
    expect(drc.drLeaves.every(
      node => typeof node.matchFunction === 'function'
    )).toBe(true)
  })

  it('right after the execution of DRC.pickLeafRequirements, \nevery leaf should have a `children` property of length 0 array', () => {
    drc.dr = dr_19_let_touyoushi_sm0
    drc.pickLeafRequirements()

    expect(drc.drLeaves.every(
      node => (node.children) && (node.children.length === 0)
    )).toBe(true)
  })

  it.skip("should set leaf node's `passed_unit` to be a computed property summing all children's units", () => {
    drc.dr = dr_19_let_touyoushi_sm0
    drc.pickLeafRequirements()

  
  })
})

// it.skip('DRC', () => {
  
// })

