import { DRC, getPlannerTable } from '../src/drc/DRC'
import { beforeEach } from 'vitest'

let drc: DRC
beforeEach(() => {
  drc = new DRC()
})

describe("Change in `drc.records_all.value` changes the computed value of plannerTable", () => {
  it("Add 0 course should not change anything", () => {
    const ap_before = JSON.stringify(getPlannerTable(drc.records_all.value))
    drc.addCourses([], 2019, 0)

    const ap_after = JSON.stringify(getPlannerTable(drc.records_all.value))

    expect(ap_before == ap_after).toEqual(true)
  })

  // it.todo("Add 1 course ", () => {
  //   const ap_before = JSON.stringify(drc.ap)
  //   drc.addCourses([], 2019, 0)

  //   const ap_after = JSON.stringify(drc.ap)

  //   expect(ap_before == ap_after).toEqual(true)
  // })
})