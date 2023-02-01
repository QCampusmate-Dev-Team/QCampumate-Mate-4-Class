import { DRC } from '../src/drc/DRC'
import { beforeEach } from 'vitest'
import { toRaw } from 'vue'

let drc: DRC
beforeEach(() => {
  drc = new DRC()
  
})

describe.todo("Change of `drc.records_all.value.length` should trigger re-computation of `drc.ap`", () => {
  it("Add 0 course should not change anything", () => {
    const ap_before = JSON.stringify(toRaw(drc.ap))
    drc.addCourses([], 2019, 0)

    const ap_after = JSON.stringify(toRaw(drc.ap))

    expect(ap_before == ap_after).toEqual(true)
  })

  it.todo("Add 1 course ", () => {
    const ap_before = JSON.stringify(drc.ap)
    drc.addCourses([], 2019, 0)

    const ap_after = JSON.stringify(drc.ap)

    expect(ap_before == ap_after).toEqual(true)
  })
})