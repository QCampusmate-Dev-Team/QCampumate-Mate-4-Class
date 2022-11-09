import * as ftrCompiler from './FilterCompiler'
import { ref, reactive, Ref, UnwrapNestedRefs} from 'vue'
import { GradeEntry, GradeFilterOptions, PlannerTable} from '../../lib/types';
// import store from '../store/index.js'

interface DRCTree {
}

interface DRCTreeNode {
}

class DRC {
  ap: UnwrapNestedRefs<any>
  tree: Ref<any>; // the DRC Tree
  drLeaves: any; //DRCTreeNode[]

  constructor() {
    console.log("DRC constructor")
    // tree: Object, ap: Array<any>
    // Store the tree in Vuex
    this.tree = ref(null)
    // Serialize the tree and store it in IndexedDB
    this.ap = reactive({})
  }

  // return leaf requirements
  private pickLeafRequirements() {
  }

  public initialize() {
    // read DR from local DB and create a DRC tree out of it
    // traverse the tree, when see a rconf property, compile the filters according to the filterConf info
    // ftrCompiler.compile(rconf)
    
    chrome.storage.local.get(['DRCTree', "PlannerTables", "currAP"], ({ DRCTree, currAP, PlannerTables}) => {
      // console.log(`In DRC.ts, initialize(): ${JSON.stringify(DRCTree)}`)
      this.tree.value = DRCTree
      if (!PlannerTables[currAP]) {
        alert(`Unexpected undefined: PlannerTables[${currAP}] is undefined!!`)
      }
      console.log("in DRC.ts, initialize() ", PlannerTables[currAP])
      Object.assign(this.ap, PlannerTables[currAP])
    })
  }

  public addCourseToAP() {
    this.ap.value.push(10)
  }
  private dumpDRC() {
    // send a DUMP_DRC message to service worker
  }

  log() {
  }

  serialize() {
    JSON.stringify(this.tree)
  }
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
  }

  const FIRSTQUARTER = new Set(['前', '夏学期', '前期集中', '春学期']);
  const SECONDQUARTER = new Set(['後', '秋学期', '後期集中', '冬学期', '通年']);
  
  const quarterSelector = typeof quarter === 'undefined' ? null : (quarter === 0 ? ((q:string) => FIRSTQUARTER.has(q)) : ((q:string) => SECONDQUARTER.has(q)));

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

  const LETTER_TO_GP = {
    'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0,
  };
  const plannerTable = typeof quarter === 'undefined' ? planner_table[year].flat() : planner_table[year][quarter];
  // console.log(plannerTable, quarter, year, category);

  const grade_statistics = plannerTable
    .filter(
      (e) => ['A', 'B', 'C', 'D', 'F']
        .includes(e.letter_evaluation),
    )// Process only A, B, C, D, F courses
    .filter((e) => (typeof (category) === 'string' ? e.category === category : true))
    .reduce((agg, e) => {
      const { unit, letter_evaluation, gpa } = e

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

export { DRC, filterBy, aggregate }