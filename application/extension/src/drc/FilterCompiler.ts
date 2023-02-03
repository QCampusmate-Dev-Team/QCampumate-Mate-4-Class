import type { MatchOptions, Course, GradeEntry, MatchFunctionType } from '@qcampusmate-mate/types'

////////////////Helper functions//////////////////
//////////////////////////////////////////////////

/**
 * Concatenate (school, major, subjectCode) into numberlink
 * 
 * @param {Course} crs
 * @returns {String}
 */
const smcToNumberLink = (crs: Course) => {
  const smc = `${crs.school}-${crs.major}${crs.subjectCode}`
  return smc
}

/**
 * Parse the GradeEntry if it matches with the numberlink pattern and 
 * 
 * 
 * @param {GradeEntry} ge 
 * @returns {Object} - the parsed object if pattern matches. Otherwise, returns an empty object
 */
const numberLinkToSmc = (ge: GradeEntry) => {
  const reg = /([A-Z]+)-([A-Z]+)([0-9]*[A-Z])/
  const matched  = ge.numberlink.match(reg)

  return matched&&matched.length===4 ? {school: matched[1], major: matched[2], code: matched[3]} : {}
}

////////////////////////Test/////////////////////
export function compileMatchOptions (matchOptions: MatchOptions): MatchFunctionType {
  /**
   * Boolean function instantiating the set of MatchOptions specified on a Degree Requirement Leaf
   * 
   * Implementation note:
   * Due to the missing numberlinks and unreasonable numberlink encoding for some courses(e.g. HUM) in Campusmate-J, current implementation of this matching function uses two disjoint ways of matching courses based on existence of `like` keys:
   *  1. Match using numberlinks(mustHas only), or school, major(include/exclude)
   * 
   *  2. Match with (name,[school]), name is specified by `like` property
   * 
   * @param {GradeEntry}
   * @return {Boolean} - True if the GradeEntry satisfies any of the specified MatchOptions 
   */
  return function matchFunction(g:GradeEntry){
    var mustHasCourse: boolean = false,  // mustHas courses
        mustHasCourseLike: boolean = false,  // mustHas like
        includeFinal: boolean = false,  // include school major 
        excludeFinal: boolean = false

    // if exclude is specified,
    //   exclude, i.e, return false if the course satisfes all the specified exclude matchOptions
    if (matchOptions.exclude) {
      const exclude = matchOptions.exclude
      var excludeCourse = false,
          excludeSchool = false, 
          excludeMajor = false,
          excludeLike = false
      
      if(exclude.courses) {
        excludeCourse = exclude.courses.some((crs: Course) => smcToNumberLink(crs) === g.numberlink)
      }

      if(exclude.majors){
        excludeMajor = exclude.majors.some(major => major === numberLinkToSmc(g)['major'])
      
      }
      if(exclude.schools){
        excludeSchool = exclude.schools.some(school => school === numberLinkToSmc(g)['school'])
      }

      if(exclude && exclude.like) {
        excludeLike = new RegExp(exclude.like, 'i').test(g.subject)
      }
      
      if (excludeCourse &&
          excludeSchool &&
          excludeMajor &&
          excludeLike)
        return false
    }

    if (matchOptions.mustHas) {
      const mustHas = matchOptions.mustHas
      if (mustHas.courses && 
        mustHas.courses.some((crs: Course) => smcToNumberLink(crs) === g.numberlink)) 
          return true  
      
      if (mustHas.like && 
        new RegExp(mustHas.like, 'i').test(g.subject))
        return true
    }

    // if include is specified
    //    return true if the course satisfes all the specified include matchOptions. Otherwise, return false
    if(matchOptions.include) {
      const include = matchOptions.include
      var includeCourse = true, 
          includeSchool = true,
          includeMajor = true,
          includeLike = true

      if(include.courses) {
        includeCourse = include.courses.some((crs: Course) => smcToNumberLink(crs) === g.numberlink)
      }

      if(include.majors){
        includeMajor = include.majors.some(major => major === numberLinkToSmc(g)['major'])
      
      }
      if(include.schools){
        includeSchool = include.schools.some(school => school === numberLinkToSmc(g)['school'])
      }

      if(include && include.like) {
        includeLike = new RegExp(include.like, 'i').test(g.subject)
      }

      includeFinal = includeCourse && includeSchool && includeMajor && includeLike

      if (includeFinal) 
        return true
    }


    return false
    // return mustHasCourse || mustHasCourseLike || includeFinal || il
  }
}
//////////////////////////////////////////////////