import type { DegreeRequirementBase, StudentInfo, LeafReq, Req, GradeEntry } from '@qcampusmate-mate/types'
import { expect, it } from 'vitest'
import type { ComputedRef } from 'vue'
import * as _ from 'lodash'
import { DRC, CompiledLeafReq, sumUnits, getMinPartialSumSubset, pickSatisfyingMinUnits } from '../src/drc/DRC'
import dr_19_let_touyoushi_sm from './dr_19_let_touyoushi_small'
// All subsets are disjoint
import dr_19_let_touyoushi_sm0 from './dr_19_let_touyoushi_small0'


// Union of all subsets is the original set
describe('test pickLeafRequirements', () => {
  let drc: DRC
  beforeEach(() => {
    drc = new DRC()
  })

  describe('can pick correct number of leaves', () => {
    it('drLeaves(# = 2)', () => {
      drc.drcTree = _.cloneDeep(dr_19_let_touyoushi_sm)
      drc.pickLeafRequirements()
      expect(drc.drcTree).toBeTruthy()
      expect(drc.drLeaves.length).toEqual(2)
    })
  
    it('drLeaves(# = 5)', () => {
      drc.drcTree = _.cloneDeep(dr_19_let_touyoushi_sm0)
      drc.pickLeafRequirements()
      expect(drc.drcTree).toBeTruthy()
  
      expect(drc.drLeaves.length).toEqual(5)
    })
  })

  it('all MatchOptions on leaf nodes should be converted into Match Functions', () => {
    drc.drcTree = _.cloneDeep(dr_19_let_touyoushi_sm0)
    drc.pickLeafRequirements()

    expect(drc.drLeaves.every(
      node => typeof node.matchFunction === 'function'
    )).toBe(true)
  })

  it('right after the execution of DRC.pickLeafRequirements, \nevery leaf should have a `children` property of length 0 array', () => {
    drc.drcTree = _.cloneDeep(dr_19_let_touyoushi_sm0)
    drc.pickLeafRequirements()

    // .map(e => e.label).join('\n')
    // console.log(drc.drLeaves)

    expect(drc.drLeaves.every(
      node => (node.children) && (node.children.length === 0)
    )).toBe(true)
  })

  it('CompiledLeafReq sets `passed_units` as computed property correctly', () => {
    const 基幹セミナー = _.cloneDeep(dr_19_let_touyoushi_sm).req.keg.children[0]

    const kisemiCompiled = new CompiledLeafReq(基幹セミナー as LeafReq) //.kikan_seminar
    // empty leaf req
    expect(kisemiCompiled.passed_units.value).toStrictEqual(0)

    kisemiCompiled.children.push({ label: 'k', subject: 'k', status: 2, unit: 1})
    expect(kisemiCompiled.passed_units.value).toStrictEqual(1)
  })
})

describe('Set up `passed_units` reactive dependencies on drc tree', () => {
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
    postOrder = []
  })

  it('Empty tree', () => {
    drc.drcTree = _.cloneDeep(dr_19_let_touyoushi_sm0)
    drc.pickLeafRequirements()
    drc.setUpPassedUnitsDeps()
    // console.log(drc.drLeaves)
    const ans = [0, 0, 0, 0]     
    for (const [key, req] of Object.entries(drc.drcTree.req)) {
      traverse(req)
    }
      
    expect(postOrder).toEqual(ans)
  }),

  it('dr_19_let_touyoushi_small0 with node insertion', () => {
    drc.drcTree = _.cloneDeep(dr_19_let_touyoushi_sm0)
    drc.pickLeafRequirements()
    drc.setUpPassedUnitsDeps()
    for (let i = 0 ; i < drc.drLeaves.length; i++) {
      switch (drc.drLeaves[i].label) {
        case '基幹教育セミナー':
          drc.drLeaves[i].children.push({
            label:'kisemi',
            subject: 'kisemi',
            status: 2,
            unit: 1
          })
        break
        case '人文学科共通科目':
          drc.drLeaves[i].children.push({
            label:'人文学 I',
            subject: '人文学 I',
            status: 2,
            unit: 2
          }, 
          {
            label:'人文学 II',
            subject: '人文学 II',
            status: 2,
            unit: 2
          })
        break
        case '中国語':
          drc.drLeaves[i].children.push({
            label:'中国語',
            subject: '中国語',
            status: 2,
            unit: 1
          })
        break
        case '英語':
          drc.drLeaves[i].children.push({
            label:'英語',
            subject: '英語',
            status: 2,
            unit: 1
          })
        break
        case 'その他':
        break
      }
    }

    const ans = [1, 2, 6, 6]     
    for (const [key, req] of Object.entries(drc.drcTree.req)) {
      traverse(req)
    }
    expect(postOrder).toEqual(ans)
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

  describe('test subset sum algorithm', () => {
    it('T=6, A=[2, 2.5, 2, 1.5, 2], sum only', () => {
      const A = [2, 2.5, 2, 1.5, 2]
      const T = 6
      expect(getMinPartialSumSubset(A, T)).toStrictEqual([6, [1, 2, 3]])
    })

    it('T=6, A=[2, 2.5, 2, 2.5]', () => {
      const A = [2, 2.5, 2, 2.5]
      const T = 6
      expect(getMinPartialSumSubset(A, T)).toStrictEqual([6.5, [0, 1, 2]])
    })

    it('T=10, A=[2, 2.5, 2, 2.5], can\'t sum up to `T`', () => {
      const A = [2, 2.5, 2, 2.5]
      const T = 10
      expect(getMinPartialSumSubset(A, T)).toStrictEqual([-1, []])
    })

    it('T=0, A=[], null case', () => {
      const A = []
      const T = 0
      expect(getMinPartialSumSubset(A, T)).toStrictEqual([0, []])
    })

    it('T=1, A=[2], array of one element', () => {
      const A = [2]
      const T = 1
      expect(getMinPartialSumSubset(A, T)).toStrictEqual([2, [0]])
    })

    it('T=2, A=[1, 0, 0, 0, 1], include 0 indices, surprise!!', () => {
      const A = [1, 0, 0, 0, 1]
      const T = 2
      expect(getMinPartialSumSubset(A, T)).toStrictEqual([2, [0, 1, 2, 3, 4]])
    })
  
    it('T=2.5, A=[1, 0, 0, 0, 1, 1.5], include 0 indices, surprise!! Why!?', () => {
      const A = [1, 0, 0, 0, 1, 1.5]
      const T = 2.5
      expect(getMinPartialSumSubset(A, T)).toStrictEqual([2.5, [4, 5]])
    })
  })

  describe('test select minimum set of courses satisfying minUnit', () => {
    it('select exact with nulls', () => {
      const ge: Partial<GradeEntry>[] = [
        {label: 'a', unit: 1},
        {label: 'b', unit: 1.5},
        {label: 'c' },
        {label: 'd', unit: 3},
        {label: 'e', unit: 2},
      ]
  
      const minUnit = 5
      expect(pickSatisfyingMinUnits(ge as GradeEntry[], minUnit).map(({label}) => label)).toEqual(['c', 'd', 'e'])
    })

    it('empty', () => {
      const minUnit = 5
      expect(pickSatisfyingMinUnits([], minUnit).map(({label}) => label)).toEqual([])
    })
  })
})
// it.skip('DRC', () => {
  
// })

