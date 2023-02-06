import { compileMatchOptions } from './FilterCompiler'
import { ref, reactive, computed, watch } from 'vue'
import type { Ref , UnwrapNestedRefs, ComputedRef } from 'vue'
import * as _ from 'lodash'
import type { GradeEntry, GradeFilterOptions, PlannerTable, _PlannerTableEntry, DegreeRequirementBase, LeafReq, Req, MatchFunctionType, CompiledLeafReqInterface } from '@qcampusmate-mate/types';

class CompiledLeafReq implements CompiledLeafReqInterface{
  label: string;
  minUnit: number;
  matchFunction: MatchFunctionType;
  children: UnwrapNestedRefs<GradeEntry[]>;
  minFirstYear?: number;
  passed_units: ComputedRef<number>;
  elecComp?: -1 | 0 | 1 | 2 | 3 ;

  constructor(leafReq: LeafReq) {
    this.label = leafReq.label
    this.minUnit = leafReq.minUnit
    this.matchFunction = compileMatchOptions(leafReq.matchOptions)
    this.children = reactive<GradeEntry[]>([])
    this.passed_units = computed(() => {
      return sumUnits(this.children)
    })
    this.elecComp = leafReq.elecComp
  }

  toString() {
    return `${this.label}(minUnit=${this.minUnit})`
  }
}

class DRC {
  maxYearInAp: Ref<number>;
  drLeaves: CompiledLeafReq[]; 
  gpaData: GradeEntry[];
  drcTree: DegreeRequirementBase;
  records_all: Ref<GradeEntry[]> //UnwrapNestedRefs<GradeEntry[]>
  dataSource: Object

  constructor(gpaData=null) {
    this.gpaData = gpaData // need type def
    this.drLeaves = []
    this.maxYearInAp = ref<number>(0)

    // Serialize the tree and store it in IndexedDB
    this.records_all = ref<GradeEntry[]>([])  
    this.dataSource = { name: 'ChromeStorageAPI' }
  }

  /**
   *  Initialize DRC from the specified data source 
   *  Currently supports:
   *    - Chrome Storage API
   *  
   *  Considering to add:
   *    - Indexed DB 
   *    - RESTAPI
   */
  public initialize(dataSource?: string, DRCDataObject?: Object) {
    switch(dataSource) {
      case 'object':
        if (!DRCDataObject) throw Error('@DRC, initialized(): specified data source is "object", but `DRCDataObject` is undefined.')
        console.log(DRCDataObject)
        break
      case undefined:
        console.info('@DRC, initialized(): use deafult data source:', this.dataSource['name'])
        break
      default:
        console.error('@DRC, initialized(): specified data source is not currently supported.')
    }

    return new Promise<DRC>((resolve, reject) => {
      try {
        chrome.storage.local.get(["GPADATA", "DR", "records_all", "maxYearInAp"], ({ GPADATA, DR, records_all, maxYearInAp }) => {
          // console.log(`@DRC.ts initialize(): , initialize(): ${JSON.stringify(DRCTree)}`)
          // console.warn('@DRC.ts initialize(): ', records_all)
          if (!records_all) {
            alert(`成績は見つかりません！！`)
          }
          
          this.drcTree = DR
          this.gpaData = GPADATA.course_grades

          
          this.records_all.value = JSON.parse(records_all)
          this.maxYearInAp.value = Math.max(maxYearInAp, getMaxYearInRecords(this.records_all.value))

          // if (!this.drcTree.req) alert(JSON.stringify(reactive(this.drcTree), null, 2))
          this.pickLeafRequirements()
          this.setUpPassedUnitsDeps()
          this.categorize()
          // this.drLeaves.forEach(bin => {
          //   console.log(reportDRCTreeNode(bin))
          // })

          console.warn('@DRC.ts initialize(): ', records_all)
          // TODO:
          // setting up reactive deps between gpaData -> drcTree
          watch(() => this.records_all.value.length, (val, oldV) => {
            if (val > oldV) {
              console.log("@DRC.ts, watcher of this.records_all: add courses")
            } else if (val < oldV) {
              console.log("@DRC.ts, watcher of this.records_all, coures have been deleted")
            } 
            this.categorize()

            
            chrome.storage.local.set({records_all: JSON.stringify(this.records_all.value)})
          })

          resolve(this)
        })
      } catch(e) {
        console.error('Error in <DRC.initialize()>')
        reject(e)
      }
    })
  }

  //////////////////////////////////////////////////////////
  /////////////////////Preprocessing////////////////////////
  //////////////////////////////////////////////////////////

  /**
   *  This method mutates `drLeaves` property. The mutation involves the following steps:
   * 
   * 1. Traverse the DR tree, obtain the reference to each leaf node
   * 2. Convert each leaf to a `CompiledLeafReq`
   * 3. sort leaves so that higher `priority` come first and store these in `drLeaves`
   */
  public pickLeafRequirements(): void {
    let leaves = []
    function traverse(tree: Req | LeafReq, parent: Req, idx: number) {
      if (!('matchOptions' in tree)) {
        for (const [idx, subtree] of tree.children.entries()) {
          // if (subtree.children && (!subtree.children.hasOwnProperty('matchOptions')))
          traverse(subtree as Req, tree, idx)
        }
      } else { // if is leaf req
        const smartLeaf = new CompiledLeafReq(tree as LeafReq)
        parent.children[idx] = smartLeaf
        leaves.push(smartLeaf)
      } 
    }
    
    for (const [key, req] of Object.entries(this.drcTree.req)) {
      traverse(req, null, -1)
    }
    
    /** TODO
     * specialized preprocessing stage prior to this one, as it has nothing to do with setting up the drcTree in a DRC instance
     */
    // in case the node does not have a `elecComp` key
    for (let node of leaves) 
      if (typeof node.elecComp === 'undefined') 
      node['elecComp'] = -1

    leaves.sort((e1, e2) => e2['elecComp'] - e1['elecComp'])

    // sort by priority and store
    this.drLeaves.push(...leaves)
  }

  /**
   *  This method mutates `drcTree` property such that each non-leaf's 
   *  `passed_units` becomes an observer of and sums up its direct children's `passed_units`. Current implementation uses `computed` from Vue Reactive Core API.
   * 
   *  Note that the current implementation assumes all leaves of `drcTree` must
   *  be a computed property as well. In this way, it also entails that
   *  transformations(`DRC.pickLeafRequirements()`) on leaves nodes must be done
   *  first.
   */
  public setUpPassedUnitsDeps(): void {
    function r(req: Req) {
      if (!req.hasOwnProperty('matchFunction')) {
        for (let child of req.children)
          r(child as Req)
        
        req['passed_units'] = computed(() => 
          (req.children as Req[]).reduce(
            (acc: number, child: Req) => acc + (child.passed_units as ComputedRef<number>).value,
          0)
        )
      } 
    }

    for (const [key, req] of Object.entries(this.drcTree.req)) {
      r(req)
      req['passed_units'] = computed(() => 
        (req.children as Req[]).reduce(
          (acc: number, child: Req) => acc + (child.passed_units as ComputedRef<number>).value,
        0)
      )
    }
  }

  //////////////////////////////////////////////////////////
  //////////////////////////CRUD////////////////////////////
  //////////////////////////////////////////////////////////

  /** 
   *  Add multiple courses to the records_all, 
   * 
   *  Considerations: keep the number of function calls low, so as to minimize the overhead of background synchronization 
   * @param courses 
   * @param year 
   * @param quarter 
   */
  public addCourses(courses: GradeEntry[], year: number, quarter: 0 | 1) {
    try {
      // console.log(`in DRC.ts, addCourses(): add courses to year ${year}, quarter ${quarter ? "後期" : "前期"}`)
      courses = courses.map( e => {
        e['year'] = year
        e['quarter'] = quarter
        return e
      })

      this.records_all.value.push(...courses)
    } catch {
      console.error('ERR!! unexpected error in addCourses()')
    }
  }


  public deleteCourseFromAP(key: number, year: number, quarter: 0 | 1) {
    const delIdx = this.records_all.value.findIndex((c:_PlannerTableEntry) => c.plan_entry_id === key)
    this.records_all.value.splice(delIdx, 1)
  }

  /**
   * Sort grade entries into `CompiledLeafReq.children as specified by CompiledLeafReq.matchFunction and other applicable constraints
   */
  public categorize() {
    const grade_records = this.records_all.value.map((e, i) => { 
      e.matched = false
      e.id = i // For setting of a relation filterSubsetIndex => universalIndex
      return e
    })

    grade_records.forEach(ge => { 
      if (ge.matched) {
        console.warn('@DRC categorize(): same entry is categorized to two categories') 
      }
    })

    // get the reference to the leaf nodes, which are sorted by priority key 'elecComp'
    for (let req of this.drLeaves) {
      // Prepare to add yet-to-match courses
      let matchedCourses = grade_records
        .filter(e => !e.matched)
        .filter(req.matchFunction)   

      // console.log(`要件名: ${req.label}`)
      // console.log(matchedCourses.map(e => e.label).join('\n'))
      // console.log('==================')

      // calculated the sum of units
      let passed_units = sumUnits(matchedCourses)

      // empty GradeEntry[]
      req.children.length = 0
 

      // if the total units of the matched records are smaller than or equal to the required units just add them all
      // otherwise pick the satisfying minimum, then add
      const selected_entries: GradeEntry[] = (passed_units <= req.minUnit || req.elecComp === 0 ? matchedCourses : pickSatisfyingMinUnits(matchedCourses, req.minUnit))
  

      // console.log(`要件名: ${req.label}`)
      // console.log(selected_entries.map(e => e.label).join('\n'))
      // console.log('==================')

      req.children.push(...selected_entries)
      selected_entries.forEach((ge: GradeEntry) => {
        grade_records[ge.id].matched = true
      })
    }
  }

  //////////////////////////////////////////////////////////
  //////////////////////GETTER/SETTER///////////////////////
  //////////////////////////////////////////////////////////
  get matchedEntry(): GradeEntry[] {
    const matchedEntry = []
    this.drLeaves.forEach(({children}) => matchedEntry.push(...children))
    return matchedEntry
  }

  get matchedEntryCount(): number {
    return this.drLeaves.reduce((acc: number, { children }) => children.length + acc, 0)
  }

  get recordsCount(): number {
    return this.records_all.value.length
  } 

  //////////////////////////////////////////////////////////
  ////////////////////////SERIALIZER////////////////////////
  //////////////////////////////////////////////////////////
  
  public serializedDRCTreeJSON(): string{
    return JSON.stringify(reactive(this.drcTree), null, 2)
  }
}

/////////////////////////////////////////////////////////
////////////////////////SUBROUTINES//////////////////////
/////////////////////////////////////////////////////////
function getPlannerTable(course_grades: GradeEntry[], maxYearInAp?: number) {
  if (course_grades) {
    const ENROLLMENT = 2019; // temp magic number
    const newPlannerTable: PlannerTable = {};
    maxYearInAp = maxYearInAp || new Date().getFullYear()

    for (let y = ENROLLMENT; y <= maxYearInAp; y++) {
      // console.log(y)
      const zenki = filterBy(course_grades, { quarter: 0, year: y });
      const kouki = filterBy(course_grades,{ quarter: 1, year: y });
      newPlannerTable[y] = [zenki, kouki];
    }

    return newPlannerTable
  }
}

/////////////////////////////////////////////////////////
////////////////////////COMPOSABLES//////////////////////
/////////////////////////////////////////////////////////
/**
 * 
 * @param drcTreeReference 
 * @returns 
 */
function useDRCTreeComputed(drcTreeReference): ComputedRef<Array<Req>> {
  return computed(() => {
    return []
  })
}

/////////////////////////////////////////////////////////
////////////////////////UTILITIES////////////////////////
/////////////////////////////////////////////////////////

/**
 * @params {Object} obj - expect a filter option object with at
 most four keys: {quarter, year, evaluation, category}
  * @return { GradeEntry[] } - filtered grade entry, return an empty array if course_grade is empty or 
  */
 function filterBy(course_grades: GradeEntry[], gradeFilterOptions: GradeFilterOptions): GradeEntry[] | undefined { // SHOULD BUILD A FILTER FUNCTION INSTEAD OF RETURN A FILTERD OBJECT
  const { quarter, year, evaluation, category } = gradeFilterOptions

  let result: GradeEntry[] = [];
  // console.log("in DRC.ts: filterBy()")

  if (typeof quarter !== 'undefined') {
    // console.log(`Filtering by quarter... ${quarter ? '後期':'前期'}`);
    result = filterQuarter(course_grades, quarter);
  }

  if (year) {
    // console.log(`Filtering by year... ${year}`);
    result = result.filter((e: GradeEntry) => e.year === year);
  }

  if (evaluation) {
    // console.log('Filtering by grade...');
    result = result.filter((e: GradeEntry) => e.letter_evaluation === evaluation);
    // console.log(result);
  }

  if (category) {
    // console.log('Filtering by ...');
    result = result.filter((e: GradeEntry) => e.category === category);
    // console.log(result);
  }

  // console.log(result);
  // console.log('Exiting filterBy()...');
  return result;
}

/**
 * This functions filters the given grade entry by quarter
 * @params {Array<ge>} courseGrades - an Array of courseGrades objects
 * @params {number} quarter - 0: returns 前期, 1: returns 後期
 * @returns filtered courseGrades specifies by `quarter` parameter
 */
function filterQuarter(grade_entry: GradeEntry[] | undefined, quarter: number) {
  if ((typeof grade_entry === 'undefined') || (grade_entry.length === 0)) {
    console.error('Empty input in <filterQuarter(course_grades)>');
    return grade_entry
  }

  const FIRSTQUARTER = new Set(['前', '夏学期', '前期集中', '春学期', 0]); 
  const SECONDQUARTER = new Set(['後', '秋学期', '後期集中', '冬学期', '通年', 1]);
  
  const quarterSelector = typeof quarter === 'undefined' ? null : 
  (quarter === 0 ? ((q) => FIRSTQUARTER.has(q)) : ((q) => SECONDQUARTER.has(q)));

  // console.log(JSON.stringify(grade_entry, null, 2))

  return grade_entry.filter(({ quarter }) => quarterSelector(quarter));
}

// Calculate GPA and passed unit base on planner_table
/**
 *  
 */
function aggregate(gradeFilterOptions:GradeFilterOptions, planner_table: PlannerTable) {
  // - Not including withdrawn
  const { quarter, year, category } = gradeFilterOptions;
  if (!(year)) console.error('Option is missing `year` key');

  const plannerTable = typeof quarter === 'undefined' ? planner_table[year].flat() : planner_table[year][quarter];
  // console.log(plannerTable, quarter, year, category);

  
  const grade_statistics = plannerTable
    .filter(
      (e:GradeEntry | _PlannerTableEntry) => ['A', 'B', 'C', 'D', 'F']
        .includes(e.letter_evaluation) || (e as _PlannerTableEntry).isPlan
    )// Process only A, B, C, D, F courses
    .filter((e:GradeEntry | _PlannerTableEntry) => (typeof (category) === 'string' ? e.category === category : true))
    .reduce((agg, e: GradeEntry | _PlannerTableEntry) => {
      const { unit, letter_evaluation, gp } = e as GradeEntry | _PlannerTableEntry
      
      // console.log(quarter, year)
      // if (quarter ==0 && year == 2023) {
      //   console.log(`in DRC.ts, aggregate(): ${e}`)
      // }
      // if is a plan entry...
      if ((e as _PlannerTableEntry).isPlan){
        // console.log(`in DRC.ts, aggregate(): is a plan entry ${e}`)
        agg.passed_units += unit;
        return agg;
      }

      if (e.subject === '基幹教育セミナー') {
        // console.log(gp === 0 && letter === 'F');
      }
      
      if (letter_evaluation === 'R') { // == 'R'
        agg[letter_evaluation][0] += unit;
        agg.passed_units += unit;
      } else if (gp === 0 && letter_evaluation === 'F') { // == 'F'
        agg.total_gpa_units += unit;
        agg.F[0] += unit;
        // console.log(e['subject'], e['letter_evaluation'])
      } else if (['A', 'B', 'C', 'D'].includes(letter_evaluation)) { // == 'A, B, C, D'
        const totalGpa = unit * ({
          'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0,
        }[letter_evaluation]);
        agg.total_gpa_units += unit;
        agg.total_gpa += totalGpa;
        agg.passed_units += unit;
        agg[letter_evaluation][0] += unit;
        agg[letter_evaluation][1] += totalGpa;
      } 
      return agg;
    }, {
      total_gpa_units: 0,
      passed_units: 0,
      total_gpa: 0,
      A: [0, 0],
      B: [0, 0],
      C: [0, 0],
      D: [0, 0],
      F: [0, 0],
      R: [0, 0],
    });

  const avgGPA = (grade_statistics.total_gpa / grade_statistics.total_gpa_units).toFixed(2);
  // console.log(grade_statistics);
  return [avgGPA, grade_statistics.passed_units.toFixed(1)];
}

function sumUnits(ge: GradeEntry[]): number { 
  if (!ge || typeof ge.length === 'undefined'){
    console.error("@DRC.ts, sumUnits(): unexpected arg type, expecting `GradeEntry[]`")
    return 0
  }
    
  return ge.reduce((acc: number, g:GradeEntry) => {
    return acc + ((g.unit)&&(g.status > 0) ? g.unit : 0)
  }, 0)
}

function getMaxYearInRecords(ge: GradeEntry[]): number {
  return Math.max(...(ge.map(g => g.year || 0 ))) || new Date().getFullYear()
}

/**
 * Setting GradeEntry's
 * - status: a hint for different coloring in DRCTree
 *  ------------------------
 *    failed: -2
 *    withdraw: -1 
 *    ongoing: 0
 *    passed_retakable: 1
 *    passed_unretakable: 2
 *  ------------------------
 * 
 * @params {GradeEntry} ge - the course_node whose status is undetermined yet 
 * @returns {number} status - the set status of the course node
 */
function setStatusInRecordsAll(ge:GradeEntry) {
  /* Decide status based on LETTER_EVALUATION */
  // Passed/Not passed detection
  if (ge.letter_evaluation === 'F') {
    // If 'F', don't increment the passed unit
    ge.status = -2;
  } else if (['A', 'B', 'C', 'D', 'R'] // 'A', 'B', 'C', 'D', 'R'
    .includes(ge.letter_evaluation)) {
    // Mark 'D' courses as retakable;
    ge.status = ge.letter_evaluation === 'D' ? 1 : 2
  } else if (ge.letter_evaluation === 'W') { // W
    ge.status = -1;
  } else if (!ge.unit && !ge.last_updated){ // ongoing course
    ge.status = 0;
  }

  return ge
}

/**
 * This function finds the minimum PSS using dynamic programming
 * 
 * If `sum(units)` < `target`, or `units` is undefined or not an array, 
 *   return [-1, []]
 * If `target == 0`, return [0, []],
 * In other cases, return the minimum sum of `units` above `target` and the indices of the elements of that sum in `units`
 * 
 * @param units 
 * @param target 
 * @returns [the min sum, the indices of elements of that sum]
 */
function getMinPartialSumSubset(units: number[], target: number): [number, Array<number>] {
  if(target === 0) return [0, []]
  if(!units || !units.length) return [-1, []]
  const m = target * 2 + 1 + (7) // leave a 3.5 margin should be enough
  const n = units.length + 1
  
  const dp = Array(m+1).fill(false).map(a => Array(n).fill(false))
  dp[0].fill(true)
  const idx_subset_table: Array<Array<Array<number>>> = Array(m+1).fill(false).map(a => Array(n).fill([]))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      let prev = (i * .5 - units[j - 1]) * 2
      // if prev is negative then skip, as it is an index
      try {
        if (prev >= 0) dp[i][j] = dp[prev][j-1]
        if (dp[i][j]) {
          idx_subset_table[i][j] = idx_subset_table[prev][j-1].concat([j-1])
        }
      } catch(e) { // unnecessary debug block, should clean up later
        console.log(e)
        console.log(`Trying to set dp[${i}][${j}] to be dp[${prev}][${j-1}](=${dp[prev][j-1]}), dim = ${m}x${n}`)
        return [-1, []]
      }
      
      if (i / 2 >= target && dp[i][j]) {
        // console.log(idx_subset_table[i][j])
        return [i / 2, idx_subset_table[i][j]]
      }
    }
  }

  // should never reach here considering the calling context, 
  // but this means given `units` it is unable to produce any sum
  // greater than `target`
  return [-1, []]
}

/**
 * [Destructive]
 * 
 * All courses s.t. `!course.unit` evaluates to will be included
 *  
 * @param {GradeEntry[]} matchedCourse - 's `matched` property is guarenteed to be `false`
 * @param {number} minUnit
 * @param {GradeEntry[]} originalSet - a reference to the universal set of courses. Some of its elements `matched` property will be mutated
 */
function pickSatisfyingMinUnits(matchedCourses: GradeEntry[], minUnit:number, originalSet?: GradeEntry[]): GradeEntry[] {
  try {
    const res: Set<number> = new Set()
    matchedCourses = matchedCourses.map((c, i) => {
      c = Object.assign({}, c)
      if (!c.unit) {
        c.unit = 0 // make sure unit is 0, since this operates on a copy of the original, this is not destructive
        res.add(i)
      }
      return c
    })

    const units = matchedCourses.map(({unit}) => unit)
    const [sum, selected] = getMinPartialSumSubset(units, minUnit)

    // add selected indicies
    selected.forEach(i => {
        res.add(i)
        if(originalSet) 
          originalSet[matchedCourses[i].id].matched == true 
      }
    )

    return Array.from(res).map(i => matchedCourses[i])
  } catch (e) {
    console.error('@DRC.ts, pickSatisfyingMinUnits()', e)
    return []
  }
}

function fullWidthToHalf(x: string): string {
  return x.replace(
    /[\uff01-\uff5e]/g,
    function(ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xfee0); }
    )
} 

function reportDRCTreeNode(node: CompiledLeafReq) {
  return(
`
--------------------------------
${node.label}(優先度:${node.elecComp})
  passed_unit: ${node.passed_units.value}
  children:
${(node.children.map(ge => {
  return `    ${_.padEnd(fullWidthToHalf(ge.label)+' ', 30,'*')}  ${ge.unit}単位  ${ge.letter_evaluation}`
})).join("\n")}`)
}

export { 
  DRC, CompiledLeafReq,
  filterBy, aggregate, setStatusInRecordsAll, getMaxYearInRecords, getPlannerTable, sumUnits, getMinPartialSumSubset, pickSatisfyingMinUnits, reportDRCTreeNode
}