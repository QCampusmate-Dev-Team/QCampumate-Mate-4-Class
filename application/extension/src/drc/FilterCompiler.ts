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
  if (!ge || !ge.numberlink) return false 
  const reg = /([A-Z]+)-([A-Z]+)([0-9]*[A-Z])/
  const matched  = ge.numberlink.match(reg)

  return matched&&matched.length ===4 ? {school: matched[1], major: matched[2], code: matched[3]} : {}
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
    var mustFinal: boolean = false,
        includeFinal: boolean = false,  // include school major 
        excludeFinal: boolean = false

    const undefinedIsTrue = b => typeof b === 'undefined' ? true: b 

    if (matchOptions.mustHas) {
      const mustHas = matchOptions.mustHas
      var mustHasCourse: boolean,  // mustHas courses
      mustHasMajor: boolean,
      mustHasLike: boolean  // mustHas like

      if (mustHas.courses) {
        mustHasCourse = mustHas.courses.some((crs: Course) => smcToNumberLink(crs) === g.numberlink)
      } 
      
      if(mustHas.majors && g.numberlink){ 
        mustHasMajor = mustHas.majors.some(major => major === numberLinkToSmc(g)['major'])
        //   console.log(g.subject, g.numberlink, mustHas.majors,mustHasMajor, numberLinkToSmc(g)['major'])
      }

      if (mustHas.like) {
        mustHasLike = new RegExp(mustHas.like, 'i').test(g.subject)
      }

      // if(mustHas.majors && mustHas.like)
      //   console.log(g.subject, g.numberlink, mustHas.majors,mustHasMajor, numberLinkToSmc(g)['major'])

      mustFinal = undefinedIsTrue(mustHasCourse) && undefinedIsTrue(mustHasLike) && undefinedIsTrue(mustHasMajor)

      // if (mustHas.majors && mustHas.majors[0] === "LET")
      //   console.log(g.subject, g.numberlink, mustHas.majors,mustHasMajor, numberLinkToSmc(g)['major'])
      if (mustFinal) 
        return true
    }

    // if include is specified
    //    return true if the course satisfes all the specified include matchOptions. Otherwise, return false
    if(matchOptions.include) {
      const include = matchOptions.include
      var includeCourse,
          includeSchool,
          includeMajor,
          includeLike

      if(include.courses) {
        includeCourse = include.courses.some((crs: Course) => smcToNumberLink(crs) === g.numberlink)
      }

      // if the `GradeEntry`'s `numberlink` is empty, skip
      if(include.majors && g.numberlink){ 
        includeMajor = include.majors.some(major => major === numberLinkToSmc(g)['major'])
      }

      if(include.schools){
        includeSchool = include.schools.some(school => school === numberLinkToSmc(g)['school'])
      }

      if(include && include.like) {
        includeLike = new RegExp(include.like, 'i').test(g.subject)
        // console.log(include.like, includeLike, g.subject)
      }

      /** TODO: consider next two blocks, can we do better? */

      // If some specified match key does not exist on the course, try match others
      includeFinal = undefinedIsTrue(includeCourse) &&  
        undefinedIsTrue(includeSchool) && 
        undefinedIsTrue(includeMajor) && 
        undefinedIsTrue(includeLike)

      // If every match check misses, we cannot let the course be a match either!
      if ([includeCourse, includeSchool, includeMajor, includeLike].every(e => typeof e === 'undefined'))
        return false
      
      if (includeFinal) 
        return true
    }

    // if exclude is specified, 
    //   i.e, return false if the course satisfes all the specified exclude matchOptions
    if (matchOptions.exclude) {
      const exclude = matchOptions.exclude
      var excludeCourse = true,
          excludeSchool = true, 
          excludeMajor = true,
          excludeLike = true
      
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
      
      // console.log(exclude, excludeSchool, excludeLike, g.subject)
      if (excludeCourse &&
          excludeSchool &&
          excludeMajor &&
          excludeLike)
        return false
    }

    return false
  }
}
//////////////////////////////////////////////////