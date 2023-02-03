import type { DegreeRequirementBase, StudentInfo, LeafReq, Req, GradeEntry } from '@qcampusmate-mate/types'
import { expect, it } from 'vitest'
import { DRC, CompiledLeafReq,  sumUnits } from '../src/drc/DRC'
import { student } from '../src/fixtures/student_info_mock'
import dr_2019_let_touyoushi from '../src/fixtures/dr_2019_let_touyoushi.json'
import dr_19_let_touyoushi_sm from './dr_19_let_touyoushi_small'
// All subsets are disjoint
import dr_19_let_touyoushi_sm0 from './dr_19_let_touyoushi_small0'

let drc: DRC
// Union of all subsets is the original set
describe('test pickLeafRequirements', () => {
  beforeEach(() => {
    drc = new DRC()
  })

  describe('can pick correct number of leaves', () => {
    it('drLeaves(# = 2)', () => {
      drc.drcTree = dr_19_let_touyoushi_sm
      drc.pickLeafRequirements()
      expect(drc.drcTree).toBeTruthy()
      expect(drc.drLeaves.length).toEqual(2)
    })
  
    it('drLeaves(# = 5)', () => {
      drc.drcTree = dr_19_let_touyoushi_sm0
      drc.pickLeafRequirements()
      expect(drc.drcTree).toBeTruthy()
  
      expect(drc.drLeaves.length).toEqual(5)
    })
  })

  it('all MatchOptions on leaf nodes should be converted into Match Functions', () => {
    drc.drcTree = dr_19_let_touyoushi_sm0
    drc.pickLeafRequirements()
    
    expect(drc.drLeaves.every(
      node => typeof node.matchFunction === 'function'
    )).toBe(true)
  })

  it('right after the execution of DRC.pickLeafRequirements, \nevery leaf should have a `children` property of length 0 array', () => {
    drc.drcTree = dr_19_let_touyoushi_sm0
    drc.pickLeafRequirements()

    expect(drc.drLeaves.every(
      node => (node.children) && (node.children.length === 0)
    )).toBe(true)
  })

  it('CompiledLeafReq sets `passed_units` as computed property correctly', () => {
    const 基幹セミナー = dr_19_let_touyoushi_sm.req.keg.children[0]

    const kisemiCompiled = new CompiledLeafReq(基幹セミナー as LeafReq) //.kikan_seminar
    // empty leaf req
    expect(kisemiCompiled.passed_units.value).toStrictEqual(0)

    kisemiCompiled.children.push({ label: 'k', subject: 'k', status: 2, unit: 1})
    expect(kisemiCompiled.passed_units.value).toStrictEqual(1)
  })
})

describe('Set up `passed_units` reactive dependencies on drc tree', () => {
  beforeEach(() => {
    drc = new DRC()
  })

  it('Empty tree', () => {
    drc.drcTree = dr_19_let_touyoushi_sm0
    drc.pickLeafRequirements()
    drc.setUpPassedUnitsDeps()
  })
})

describe('helper functions', () => {
  it('sumUnits() currectly sums based on `status` and `unit`', () => {
    const ge: GradeEntry[] = [
      { label: 'a', subject: 'a', unit: 2, status: 0 },
      { label: 'b', subject: 'b', unit: 2, status: -2 },
      { label: 'c', subject: 'c', unit: 2, status: 2 },
      { label: 'd', subject: 'd', unit: 2.5, status: 1 },
    ]
    expect(sumUnits(ge)).toStrictEqual(4.5)
  })
})
// it.skip('DRC', () => {
  
// })

