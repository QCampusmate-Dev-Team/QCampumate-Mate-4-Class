import { MatchOptions, Course } from '../../lib/types'
import { GradeEntry } from '../../lib/types'

type testFn = (e: GradeEntry) => boolean;

////////////////Helper functions//////////////////
//////////////////////////////////////////////////
const smcToNumberLink = (crs: Course) => {
  const smc = `${crs.school}-${crs.major}${crs.subjectCode}`
  return smc
}
const numberLinkToSmc = (ge: GradeEntry) => {
  const reg = /([A-Z]+)-([A-Z]+)([0-9]*[A-Z])/
  const matched  = ge.subject_number.match(reg)

  return matched&&matched.length===4 ? {school: matched[1], major: matched[2], code: matched[3]} : {}
}

////////////////////////Test/////////////////////
export function compile (filterConf: MatchOptions): testFn {
  const { mustHas, include, exclude } = filterConf

  // var m, i, e;
  // if (mustHas) {
  // }

  const filter = new Function()
  return (g:GradeEntry) => {
    var mc: boolean = false, ml: boolean = false, icsm: boolean = false, il: boolean = false, ec: boolean = false, el: boolean = false

    if(mustHas && mustHas.courses) {
      mc = mustHas.courses.some((crs: Course) => smcToNumberLink(crs) === g.subject_number)
    } 

    if(mustHas && mustHas.like) {
      ml = mustHas.like.test(g.subject)
    } 

    if(include) {
      var ic = false, is =  false, im = false;
      if(include.courses) {
        ic = include.courses.some((crs: Course) => smcToNumberLink(crs) === g.subject_number)
      }
      if(include.majors){
        im = include.majors.some(major => major === numberLinkToSmc(g)[major])
      }
      if(include.schools){
        is = include.schools.some(school => school === numberLinkToSmc(g)[school])
      }
      icsm = ic || is || im
    }

    if(include && include.like) {
      il = include.like.test(g.subject)
    }

    return mc || ml || icsm || il
  }
}
//////////////////////////////////////////////////