import randn_bm from './normal'
import CourseRecordDTO from './courseRecordDTO'

function generateRandomGP(): [number, string] {
  const rand = randn_bm()
  var gp_letterEval:[number, string]

  if(rand > -0.3 && rand < 0.3) {
    gp_letterEval = [3, 'B']
  } else if (rand > -1.2 && rand <= -0.3 || rand >= 0.3 && rand < 1.2){
    gp_letterEval = [4, 'A']
  } else if (rand > -2 && rand <= -1.2 || rand >= 1.2 && rand < 2) {
    gp_letterEval = [2, 'C']
  } else if (rand > -2.5 && rand <= -2 || rand >= 2 && rand < 2.5) {
    gp_letterEval = [1, 'D']
  } else {
    gp_letterEval = [0, 'F']
  }

  return gp_letterEval
}

function generateGPRandomizedCourseRecord(courseRecord :CourseRecordDTO): CourseRecordDTO {
  let gp, letter_evaluation
  if (courseRecord.subject === '基幹教育セミナー') {
    gp = '*'
    letter_evaluation = generateRandomGP()[0] !== 0 ? 'R' : 'F'
  } else {
    [gp, letter_evaluation] = generateRandomGP()
  }

  return Object.assign({}, courseRecord, {gp, letter_evaluation}) 
}

export { generateGPRandomizedCourseRecord as default, generateGPRandomizedCourseRecord }