import course_record_let_raw from './grade_entry/course_record_let_raw.json'
import CourseRecordDTO from '../src/utils/courseRecordDTO'
import { cloneDeep, isEqual } from 'lodash'

let courseRecordDTOs: CourseRecordDTO[]
beforeAll(() => {
  courseRecordDTOs = cloneDeep(course_record_let_raw).map(c => new CourseRecordDTO(c))
})

describe('CourseRecordDTO converts types correctly', () => {
  it('test `subject` and `label` is not empty', () => {
    expect(courseRecordDTOs.every(c => c.subject !== '' && c.label !== '')).toBe(true)
  })

  it('test `school` in ["KED", "LET", "ISI", "EDU", "LAW", "ECO", "SCI", "MED", "DEN", "PHS", "ENG", "DES", "AGR", "21P", ""]', () => {
    const possibleSchools = new Set(["KED", "LET", "ISI", "EDU", "LAW", "ECO", "SCI", "MED", "DEN", "PHS", "ENG", "DES", "AGR", "21P", ""]) 

    expect(courseRecordDTOs.every(c => possibleSchools.has(c.school))).toBe(true)
  })

  it('test `major` is a string', () => {
    expect(courseRecordDTOs.every(({major}) => typeof major === 'string'))
  })  

  it('test `unit` in [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, null]', () => {
    const possibleUnits = new Set([1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, null, NaN]) 

    expect(courseRecordDTOs.every(c => {
      if (!possibleUnits.has(c.unit)) {
        console.log(c)
        return false
      }
      else return true
    })).toBe(true)
  })

  it("test letter_evaluation is in ['S', 'A', 'B', 'C', 'D', 'F', 'W', 'R']", () => {
    const possibleLE = new Set(['S', 'A', 'B', 'C', 'D', 'F', 'W', 'R', undefined]) 

    expect(courseRecordDTOs.every(c => {
      if (!possibleLE.has(c.letter_evaluation)) {
        console.log(c)
        return false
      }
      else return true
    })).toBe(true)
  })  
  
  it('test `year` is a number', () => { 
    expect(courseRecordDTOs.every(c => typeof c.year === 'number')).toBe(true)
  })  

  it('test `quarter` is a string', () => { 
    expect(courseRecordDTOs.every(c => typeof c.quarter === 'string')).toBe(true)
  })  

  it('test `numberlink` is a string', () => { 
    expect(courseRecordDTOs.every(c => typeof c.numberlink === 'string')).toBe(true)
  })  

  it('test `course_id` is a number', () => { 
    expect(courseRecordDTOs.every(c => typeof c.course_id === 'number')).toBe(true)
  })  

  it('test `last_updated` is a string', () => { 
    expect(courseRecordDTOs.every(c => typeof c.last_updated === 'string')).toBe(true)
  })

  it('test `prinstructor` is a string', () => { 
    expect(courseRecordDTOs.every(c => typeof c.prinstructor === 'string')).toBe(true)
  })
})

test('Identical before/after serialization', () => {
  courseRecordDTOs.forEach(c => {
    if(!isEqual(JSON.parse(JSON.stringify(c)), Object.assign({}, c))){
      console.log(Object.assign({}, c), '\n', JSON.parse(JSON.stringify(c)))
      console.log("===============")
    }
  })

  expect(courseRecordDTOs.every(c => isEqual(JSON.parse(JSON.stringify(c)), Object.assign({}, c)))).toBe(true)
})