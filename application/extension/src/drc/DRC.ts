import * as ftrCompiler from './FilterCompiler'
import { ref, reactive, computed, watch } from 'vue'
import type { Ref , UnwrapNestedRefs, ComputedRef } from 'vue'
import { Course, GradeEntry, GradeFilterOptions, PlannerTable, PlannerTableEntry, _PlannerTableEntry } from '@qcampusmate-mate/types';
import { savePlannerTable } from '../utils/sync'
// import store from '../store/index.js'

const LETTER_TO_GP = {
  'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0,
};

interface DRCTree {
}

interface DRCTreeNode {
}

class DRC {
  ap: UnwrapNestedRefs<PlannerTable>
  // tree: UnwrapNestedRefs<any>; // the DRC Tree
  drLeaves: any; //DRCTreeNode[]
  currAP: number;
  gpaData: GradeEntry[];
  dr: Object;
  dr_smart: Object;
  records_all: Ref<GradeEntry[]> //UnwrapNestedRefs<GradeEntry[]>

  constructor(gpaData=null, dr={}) {
    console.log("DRC constructor")
    // tree: Object, ap: Array<any>

    this.gpaData = gpaData // need type def
    this.dr_smart = {}
    this.dr = dr // need type def
    // this.tree = reactive({
    //   data: []
    // })

    // this.tree = computed(() => {
    //   return DRC.generateDRCTree(this.dr_smart, this.gpaData)
    // })


    // Serialize the tree and store it in IndexedDB
    this.ap = reactive({})
    this.records_all = ref<GradeEntry[]>([])  
  }

  // return leaf requirements
  private pickLeafRequirements() {

  }

  /**
   *  Initialize DRC according to different persistente layers.
   *  Currently supports:
   *    - Chrome Storage API
   *    - Indexed DB 
   *  
   *  Considering to add:
   *    - RESTAPI
   */
  public initialize() {
    // read DR from local DB and create a DRC tree out of it
    // traverse the tree, when see a rconf property, compile the filters according to the filterConf info
    // ftrCompiler.compile(rconf)
    return new Promise<DRC>((resolve, reject) => {
      try {
        chrome.storage.local.get(["PlannerTables", "currAP", "GPADATA", "DR", "records_all"], ({ currAP, PlannerTables, GPADATA, DR, records_all }) => {
          // console.log(`In DRC.ts, initialize(): ${JSON.stringify(DRCTree)}`)

          if (!PlannerTables[currAP]) {
            // alert(`Unexpected undefined: PlannerTables[${currAP}] is undefined!!`)
            alert(`成績は見つかりません！！`)
          }
          console.log("in DRC.ts, initialize() ", PlannerTables[currAP])
    
          this.dr = DR
          this.gpaData = GPADATA.course_grades
          this.records_all.value = JSON.parse(records_all)
    
          Object.assign(this.ap, PlannerTables[currAP])
          // this.tree.data = JSON.parse(DRCTree).data
          // alert(DRCTree)
          this.currAP = currAP
  
    
          // TODO:
          // setting up reactive deps between gpaData -> drcTree
          watch(() => this.records_all.value.length, (val, oldV) => {
            console.log('watching!!', val, oldV)
            // console.log(JSON.stringify(this.ap_test.value, null, 2))


            if (val > oldV) {
              console.log("@DRC.ts, watcher of this.records_all: add courses")
            } else if (val < oldV) {
              console.log("@DRC.ts, watcher of this.records_all, coures have been deleted")
            } 
            // this.categorize()
            
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

  /**
   * Add an empty year table to current plannerTable
   * @returns void
   */
  public addNextYearToAP(): void {
    const maxYear = this.getMaxYearInAP()
    this.ap[maxYear+1] = [[], []]
  }

  /**
   * @returns {number}the maximum year in the current AP
   */
  public getMaxYearInAP(): number {
    const years = Object.keys(this.ap).map(y => parseInt(y))
    return Math.max(...years)
  }

  /** 1. Add multiple courses to the AP, 
   *  2. Update PlannerTables in client storage 
   * 
   *  Considerations: keep the number of function calls low, so as to minimize the overhead of background synchronization 
   * @param courses 
   * @param year 
   * @param quarter 
   */
  public addCourses(courses: Course[], year: number, quarter: 0 | 1) {
    if ((year in this.ap)) {
      // console.log(`in DRC.ts, addCourses(): add courses to year ${year}, quarter ${quarter ? "後期" : "前期"}`)
      courses = courses.map( e => {
        e['year'] = year
        e['quarter'] = quarter
        return e
      })
      // alert(`adding courses:${JSON.stringify(courses, null, 2)}`)

      this.records_all.value.push(...courses)
      // console.log(JSON.stringify(this.ap, null, 2) )
      // console.log(courses)
      // console.log(`@DRC, addCourses()\n: ${JSON.stringify(this.records_all.value, null, 2)}`)
      this.ap[year][quarter].push(...courses)
      

    } else {
      throw Error(`ERR!! Non-existing year or quarter! Attempt to add courses to ${year}, ${quarter}`)
    }
  }


  public deleteCourseFromAP(key: number, year: number, quarter: 0 | 1) {
    // const i = this.ap.find(courseKey)
    if((year in this.ap)) {
      const delIdx = this.records_all.value.findIndex((c:_PlannerTableEntry) => c.plan_entry_id === key)
      this.records_all.value.splice(delIdx, 1)

      const _delIdx = this.ap[year][quarter].findIndex((c:_PlannerTableEntry) => c.plan_entry_id === key)
      this.ap[year][quarter].splice(_delIdx, 1)
    } else {
      alert(`ERR!! in DRC.ts, deleteCourseFromAP(): ${year} is not a key of this.ap.`)
    }
  }

  /**
   * NOUSE
   * @param deleteKeys 
   * @param year 
   * @param quarter 
   */
  public deleteCourses(deleteKeys: number[], year: number, quarter: 0 | 1) {
    // delete courses from the AP
    for (let k of deleteKeys) 
      this.deleteCourseFromAP(k, year, quarter)

    // update PlannerTables in client storage
    savePlannerTable(this.ap, this.currAP)
  }


  /**
   *  Sort gpaData into baskets as specified by dr_smart
   */
  public categorize() {
    var a = Array(5).fill(1).map(e=>({'label': Math.floor(Math.random()*10), 'children': []}))
    for (let el of a) {
      el['children'].push(el['label'] * 3)
    }

    const _gpaData = this.gpaData.map(e => { 
      e.matched = false
      return e
    })

    // get the reference to the leaf nodes, sort by their priority
    for (let req of this.drLeaves) {
      // get the unmarked, matched courses
      let matchedCourses = _gpaData
        .filter(e => !e.matched)
        .filter(req.matchFunction)   

      // calculated the units
      let passed_units = matchedCourses.reduce((sum, course) => sum + course.unit, 0)

      // if the total units of the matched records are above the required units, pick the unmarked, satisfying minimum 
      req.children = passed_units <= req.minimum ? matchedCourses : pickSatisfyingMinUnits(matchedCourses)
    }
  }


  /**
   * Assume at the invokation, the function will be provided
   * with a context <this> whose `meta` and `data` properties are expected to be initialized as specified in 卒業要件データ定義
   * 
   * @params {Object} degree_requirement - see degree_requirement.js
   * @returns { DRC } - fluent API style
   */
  public initializeRequirementTree(degree_requirement, gpadata) {
    /**
     * 
     * STATUS = {failed: -2, withdraw: -1, ongoing: 0, passed_retakable: 1, passed_unretakable: 2}
     * @params {number} index - the index of the course record of the gpaData in global storage
     * @params {Object} course_node - the course_node whose status is undetermined yet 
     * @returns {number} status - the set status of the course node
     */
    function setNodeStatus(course_record, course_node){
      course_node.label = course_record.subject;
      course_node.units = parseFloat(course_record.unit) || 0;

      // console.log(`${course_record.subject} has ${course_node.units} units; Setting ${course_record.subject} to be a leaf node of ${curr_node.label}`)

      // Passed/Not passed detection
      if (course_record.letter_evaluation === 'F') {
        // If 'F', don't increment the passed unit
        course_node.status = -2;
      } else if (['A', 'B', 'C', 'D', 'R'] // 'A', 'B', 'C', 'D', 'R'
        .includes(course_record.letter_evaluation)) {
        if (course_record.letter_evaluation === 'D') {
          // Mark 'D' courses as retakable;
          course_node.status = 1;
        } else {
          course_node.status = 2;
        }
      } else if (course_record.letter_evaluation === 'W') { // W
        course_node.status = -1;
      } else if (course_record.unit === '' && course_record.last_updated === ''){ // ongoing course
        course_node.status = 0;
      }

      course_node.passed_units = course_node.status >= 1 ? course_node.units : 0;
    
      return course_node.status;
    }

    /**
     * This function determines the state(passed/retakable(i.e.
     * letter_evalution <= 'D')/failed/etc..) of a single courseRecord
     * <gradeRecoard> and set the leaf of current DRC tree node <curr_node> accordingly
     * @params {Object} course_record - gpaData.course_records (DELETE
     * this param upon next refactoring)
     * @params {number} index - index of course_records in gpaData.course_records
     * @params {Object} curr_node - assume to be a leaf node in
     * `degree_requirement`` data structure
     * @returns void
     */
    function setDRCTreeNode(course_record, index, curr_node) {
      const course_node = { passed_units: 0 };

      // Subroutine to set the node status based on its letter_evaluation et.al.
      setNodeStatus(course_record, course_node); 
      
      curr_node.passed_units = Math.min(curr_node.units, curr_node.passed_units + course_node.passed_units);
      // console.log(`${curr_node.label} = ${curr_node.passed_units}`);
      curr_node.children.push(course_node);
      seen.add(index);
    }

    // Solve the Subset Sum problem using Dynamic programming
    // This function should only be called by
    // <getSubsetOfCoursesThatHasTheMinimumPartialSumOfUnitAboveRequirement>
    function getMinPartialSumSubset_5(arr, target) {
      
      // console.log(`target ${target}, scaled ${(target - 1) / 0.5 + 3}`)
      const [m, n] = [arr.length + 1, (target - 1) / 0.5 + 3];
      const d = [];
      const dp_subset = [];

      for (let i = 0; i < m; i++) {
        d.push(new Array(n).fill(false));
        dp_subset.push(new Array(n).fill(null));
      }

      for (let i = 0; i < m; i++) {
        d[i][0] = true;
        dp_subset[i][0] = new Set();
      }

      for (let j = 1; j < n; j++) {
        d[0][j] = false;
      }

      for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
          if (arr[i - 1][1] * 2 > j) { // arr = [[index, unit], ...]
            d[i][j] = d[i - 1][j];
            dp_subset[i][j] = dp_subset[i - 1][j];
          } else {
            // d[i][j] = d[i - 1][j] || d[i - 1][j - arr[i - 1] * 2];
            if (d[i - 1][j]) {
              d[i][j] = d[i - 1][j];
              dp_subset[i][j] = dp_subset[i - 1][j];
            } else if (d[i - 1][j - arr[i - 1][1] * 2]) {
              d[i][j] = d[i - 1][j - arr[i - 1][1] * 2];
              dp_subset[i][j] = new Set(dp_subset[i - 1][j - arr[i - 1][1] * 2]);
              dp_subset[i][j].add(arr[i - 1][0]);
              // Found an optimal subset
              if (j / 2 === target) { // unscale j to the original target
                return [true, Array.from(dp_subset[i][j])];
              }
            }
          }
        }
      }
      return [false, null];
    }

    /**
     * Before entering the for-loop that adds elective courses to the tree, <
     * minPartialSumOfUnit> should be called to get the subset of the indices of
     * the courses that sum to a value as barely greater than the category
     * requirement as possible.
     * @params {Array<[number, Object]>}- coursesInCategory: [[index, CourseRecordObject], ...]
     * @returns {Array<number>} - return an array of `index`(`index` refers to the index in `course_grades`)
     */
    function getSubsetOfCoursesThatHasTheMinimumPartialSumOfUnitAboveRequirement(coursesInCategory, curr_node) {
      const required_unit = curr_node.units;
      const index_unit_arr = [];

      let unit_sum = 0;

      for (const index of coursesInCategory) {
        const { unit, letter_evaluation} = course_grades[index];
        if (letter_evaluation === 'F' ) {
          setDRCTreeNode(course_grades[index], index, curr_node)
        } else {
          unit_sum += unit;
          index_unit_arr.push([index, unit]);
        }
      }

      if (unit_sum <= required_unit) {
        return coursesInCategory;
      }
      const [isSubsetSum, subset_indices] = getMinPartialSumSubset_5(index_unit_arr, required_unit);

      return isSubsetSum ? subset_indices : coursesInCategory;
    }

    /** This function returns a matcher function that matches all elective courses that are supposed to be categorized under <curr_node>
     * @params {Object} curr_node - Assume to be a leaf node in DegReq tree
     * @returns {Function} - A filter expected by courser_grades.filter call. A call with this fill will find all course that fall under <curr_node>
     *
     */
    function createCourseCategoryMatcher(curr_node) {
      const KIKAN = new Set(['基幹教育セミナー', '課題協学科目', '言語文化基礎科目', '文系ディシプリン科目', '理系ディシプリン科目', '健康・スポーツ科目', '総合科目', 'フロンティア科目', 'サイバーセキュリティ科目', '高年次基幹教育科目', 'その他']);
      const nodeIsKikan = curr_node.grpKey && (KIKAN.has(curr_node.label) || curr_node.grpKey.includes('KED')); // All Kikan course has a grpKey
      const UPPER = ['現代史入門'];

      /* TEMPORARY HEURISTICS FOR MATCHING KIKAN COURSESE */
      // I don't have the list of all 総合科目 yet, hence we use this temporary heursitc so that the matcher will process 総合科目 correctly
      const isSouGou = curr_node.label === '総合科目';
      const isUpper = curr_node.label === '高年次基幹教育科目';
      const isOthers = curr_node.label === 'その他'; // その他

      /// //////////////////////////////////////////////////

      /* TEMPORARY HEURISTICS FOR MATCHING MAJOR COURSESE */
      const isCourseCommons = curr_node.label === 'コース共通科目';
      const isFreeElective = curr_node.label === '自由選択科目';
      const isThesis = curr_node.label === '卒業論文';

      /// //////////////////////////////////////////////////
      return function (course_record, index) {
        // The course is a kikan course only if its category is in KIKAN
        // Or it is listed as a 高年次基幹教育科目(by subject name)
        const courseIsUpperKikan = UPPER.some((key) => course_record.subject.includes(key));
        const courseIsKikan = KIKAN.has(course_record.category) || courseIsUpperKikan;

        // We add the course to the DRC tree node, only if both course and node belongs either KIKAN or MAJOR
        const doesCategoryMatch = !(courseIsKikan as any ^ nodeIsKikan);

        // MATCH KIKAN COURSES USING HEURISTICS //
        const SouGouMatch = isSouGou && course_record.subject_number.includes(curr_node.grpKey);
        const OthersMatch = isOthers && KIKAN.has(course_record.category); // Note this will make the checker's correctness dependent on the index position of その他 node in the 基幹教育.children[]: the matcher is only expected to work correctly if その他 is the last element of 基幹教育.children[].
        const UpperKikanMatch = isUpper && courseIsUpperKikan;
        /// //////////////////////////////////////

        if (curr_node.label === '高年次基幹教育科目' && course_record.subject.includes('現代史入門')) {
          console.log(`UpperKikanMatch: ${UpperKikanMatch} \n courseIsUpperKikan: ${courseIsUpperKikan}\n courseIsKikan: ${courseIsKikan} \n doesCategoryMatch: ${doesCategoryMatch} \n
          `);
        }
        // MATCH MAJOR COURSES USING HEURISTICS //
        /// //////////////////////////////////////

        return !seen.has(index)
              && doesCategoryMatch
              && (SouGouMatch /* Add to tree node if first condition matches and the course is a 総合科目. Otherwise, use the latter rules to match */
                || UpperKikanMatch || OthersMatch /* If encountering その他 node and there are still KIKAN courses left, add them all to the node */ || curr_node.courseKeys.some((key) => course_record.subject.includes(key)) && course_record.subject_number.includes(curr_node.grpKey)
                || isCourseCommons && curr_node.courseKeys.some((key) => course_record.subject.includes(key)) || course_record.subject === '卒業論文' && isThesis || isFreeElective /* This operation assumes '自由選択科目' is the last element in 専攻教育科目.children[] */
              );
      };
    }

    /** This function recursively initializes the DRC tree's view-model data structure.
     *
     * @params {Object} - At the initial invokation of this function, curr_node should either has a label called "基幹教育" or "専攻教育科目" (See degree_requirement.js);
     * @returns void - This function initialized part of the DRC's view-model, nothing to return
     */
    function initializeNode(curr_node) {
      /* Given a node representing the course structures,
      * 1. fill in the course data for view-model
      * 2. calculate and add the <passed_unit> property to each node appropriately
      */

      if (!curr_node.children) { // BASE CASE
        curr_node.children = [];
        curr_node.passed_units = 0;
        // console.log(JSON.stringify(curr_node, null, "\t"));

        if (!curr_node.elective) { // If course category is not elective, scan <course_grades> until every course in <courseKeys> have been found
          // console.log(`${curr_node.label} is not an elective!`);
          const req = new Set(curr_node.courseKeys); // Assume courseKeys has at least one element in this case, but it shouldn't cause a problem even if there is none.
          // console.log(self.gpaData.course_grades ? "ok" : "ERR");
          for (let i = 0; i < course_grades.length; ++i) {
            const curr = course_grades[i];
            if (req.has(curr.subject)) { // Matched by subject name, add the course to view-model
              if (seen.has(i)) {
                throw Error(`Error: compulsory course gets cross-listed! When processing node: ${curr_node.label}`);
              }

              setDRCTreeNode(curr, i, curr_node);
              req.delete(course_grades[i]); // This course has been checked, delete it
            }

            if (req.size === 0) break; // All requirements of this compulsory category have been met
          }
          // console.log(JSON.stringify(curr_node, null, '\t'));
        } else {
          // This node is an elective category,
          const courseMatcher = createCourseCategoryMatcher(curr_node);

          // Get courses that match the curr_node
          const coursesInCategory = []; // [[index, CourseRecordObject], ...]
          for (let i = 0; i < course_grades.length; ++i) { // ~ O(n)
            const curr = course_grades[i];
            if (courseMatcher(curr, i)) {
              coursesInCategory.push(i);
            }
          }
          // console.log("initializeNode");
          // console.log(`typeof curr_node: ${typeof curr_node}, typeof curr_node.label: ${typeof curr_node.label}, typeof curr_node.units: ${typeof curr_node.units}, ${curr_node.label}, ${curr_node.units}`);
          // Figure out the optimized subset of courses to add, and then
          // add elements of the subset to <curr_node>
          // Running time: O(curr_node.unit * coursesInCategory.length
          // This should be the bottle neck for initializng a tree node
          getSubsetOfCoursesThatHasTheMinimumPartialSumOfUnitAboveRequirement(coursesInCategory, curr_node).forEach((index) => {
            setDRCTreeNode(course_grades[index], index, curr_node);
          });

          // console.log(JSON.stringify(curr_node, null, '\t'));
        }
      } else { // Recursive count passed_unit;
        for (const childNode of curr_node.children) { // Initialized every child
          
          // console.log(`On ${curr_node.label}, starting initializing node ${childNode.label}`);
          initializeNode(childNode);
          // console.log(`On ${curr_node.label}, finishing initializing node ${childNode.label}`);
          // console.log("\n\n")
        }
        
        // all children or curr_node has passed units
        var count = 0;
        for (const childNode of curr_node.children) {
          count += childNode.passed_units;
        }
        curr_node.passed_units = Math.min(curr_node.units,count);
      }
    }


    const seen = new Set();
    const course_grades = gpadata //.course_grades; // CourseGradeEntry[]
    
    // Copy the value of degree_requirement
    // Changing properties of data[0] won't effect the prototype
    // const j = JSON.stringify(degree_requirement);
    // const clone = JSON.parse(j);
    const requirements = degree_requirement['requirements'];
    console.log('@initializeRequirementTree():', typeof requirements)
    const tree = { data: [null, null]}
    tree.data[0] = requirements['基幹教育'];
    tree.data[1] = requirements['専攻教育科目'];

    // Initialized tree values
    initializeNode(tree.data[0]);
    initializeNode(tree.data[1]);

    return tree
  }
  /**
   * 
   * @returns { DRCTree }
   */
  public dumpDRCTree(){
    // send a DUMP_DRC message to service worker
    //return JSON.stringify(this.tree, null, 2) // {"data": []}
  }

  public log() {
  }

  // serialize() {
  //   JSON.stringify(this.tree)
  // }
}

// function createDRC(): Promise<DRC> {
//   return new Promise((resolve, reject) => {
//     try {
//       chrome.storage.local.get(['DRCTree', "AP"], res => {
//         alert(`In createDRC: ${res.DRCTree} ${res.AP}`)
//         // resolve(new DRC(res.DRCTree, res.AP))
//       })
//     } catch (e) {
//       reject(e)
//     }
//   })
// }


/**
 * @params {Object} obj - expect a filter option object with at
 most four keys: {quarter, year, evaluation, category}
  * @return { GradeEntry[] } - filtered grade entry
  */
function filterBy(course_grades: GradeEntry[], obj: GradeFilterOptions): GradeEntry[] | undefined { // SHOULD BUILD A FILTER FUNCTION INSTEAD OF RETURN A FILTERD OBJECT
  const { quarter, year, evaluation, category } = obj

  let result: GradeEntry[] = undefined;
  console.log("in DRC.ts: filterBy()")
  // console.log(this.gpaData.categories);
  console.log(course_grades);
  if (typeof quarter !== 'undefined') {
    console.log(`Filtering by quarter... ${quarter ? '後期':'前期'}`);
    // console.log(typeof(this.gpaData.course_grades));
    result = filterQuarter(course_grades, quarter);
    console.log(result)
  }

  if (year) {
    console.log(`Filtering by year... ${year}`);
    result = result.filter((e: GradeEntry) => e.year === year);
    console.log(result);
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
 * @params {Array<CourseRecord>} courseGrades - an Array of courseGrades objects
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

  console.log(JSON.stringify(grade_entry, null, 2))

  return grade_entry.filter(({ quarter }) => quarterSelector(quarter));
}

// Calculate GPA and passed unit base on planner_table
/**
 *  
 */
function aggregate(obj:GradeFilterOptions, planner_table: PlannerTable) {
  // - Not including withdrawn
  const { quarter, year, category } = obj;
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
      const { unit, letter_evaluation, gpa } = e as GradeEntry | _PlannerTableEntry
      
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
        // console.log(gpa === 0 && letter === 'F');
      }
      if (letter_evaluation === 'R') { // == 'R'
        agg[letter_evaluation][0] += unit;
        agg.passed_units += unit;
      } else if (gpa === 0 && letter_evaluation === 'F') { // == 'F'
        agg.total_gpa_units += unit;
        agg.F[0] += unit;
        // console.log(e['subject'], e['letter_evaluation'])
      } else if (['A', 'B', 'C', 'D'].includes(letter_evaluation)) { // == 'A, B, C, D'
        const totalGpa = unit * LETTER_TO_GP[letter_evaluation];
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

export function getPlannerTable(course_grades: GradeEntry[]) {
  if (course_grades) {
    // console.log(filterBy(course_grades, { year: 2023 } ))
    const thisYear = new Date().getFullYear();
    const ENROLLMENT = 2019; // temp magic number
    const newPlannerTable: PlannerTable = {};

    for (let y = ENROLLMENT; y <= thisYear; y++) {
        const zenki = filterBy(course_grades, { quarter: 0, year: y });
        // console.log(`${y} 前期:`, zenki)

        const kouki = filterBy(course_grades,{ quarter: 1, year: y });
        // console.log(zenki);
        newPlannerTable[y] = [zenki, kouki];
    }

    return newPlannerTable
  }
}
///////////////////////// TODO /////////////////////////
/**
 * @params {Object} obj - expect a CourseData object containing at
 * least these four keys: {subject, letter_evaluation, unit, gpa}
 * @return {Array<PlannerFormatCourseData>}
 */
function getPlannerFormatCourseData(data) {
  const pick = ({
    subject, unit, letter_evaluation, gpa,
  }) => ({
    subject, letter_evaluation, unit, gpa,
  });
  return data.map((e) => pick(e));
}

/**
 *  
 */
function pickSatisfyingMinUnits(matchedCourses: Course[]): Course[] {
  return []
}

export { DRC, filterBy, aggregate }