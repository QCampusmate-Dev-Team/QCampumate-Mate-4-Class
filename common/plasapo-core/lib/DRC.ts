// import * as ftrCompiler from './FilterCompiler'
import { ref, reactive, Ref, UnwrapNestedRefs} from 'vue'
import { Course, GradeEntry, GradeFilterOptions, PlannerTable, PlannerTableEntry, _PlannerTableEntry } from '@qcampusmate-mate/types';

export class DRC {
  ap: UnwrapNestedRefs<PlannerTable>
  tree: UnwrapNestedRefs<any>; // the DRC Tree
  drLeaves: any; //DRCTreeNode[]
  // currAP: number;
  gpaData: Object | null;
  dr: Object | null;

  constructor(gpaData=null, dr={}) {
    console.log("DRC constructor")
    // tree: Object, ap: Array<any>

    this.gpaData = gpaData // need type def
    this.dr = dr // need type def
    this.tree = reactive({
      data: []
    })
    // Serialize the tree and store it in IndexedDB
    this.ap = reactive({})
  }

  public initialize() {
    // read DR from local DB and create a DRC tree out of it
    // traverse the tree, when see a rconf property, compile the filters according to the filterConf info
    // ftrCompiler.compile(rconf)
    if (typeof chrome != 'undefined') {

    } else {
      console.log("Chrome storage API is not available!!")
    }
  }
}


/**
 * @params {Object} obj - expect a filter option object with at
 most four keys: {quarter, year, evaluation, category}
  * @return { GradeEntry[] } - filtered grade entry
  */
 export function filterBy(course_grades: GradeEntry[], obj: GradeFilterOptions): GradeEntry[] | undefined { // SHOULD BUILD A FILTER FUNCTION INSTEAD OF RETURN A FILTERD OBJECT
  // const { quarter, year, evaluation, category } = obj

  // let result: GradeEntry[];
  // console.log("in DRC.ts: filterBy()")
  // // console.log(this.gpaData.categories);
  // console.log(course_grades);
  // if (typeof quarter !== 'undefined') {
  //   console.log(`Filtering by quarter... ${quarter ? '後期':'前期'}`);
  //   // console.log(typeof(this.gpaData.course_grades));
  //   result = filterQuarter(course_grades, quarter);
  //   console.log(result)
  // } else 
  //   return [];

  // if (year) {
  //   console.log(`Filtering by year... ${year}`);
  //   result = result.filter((e: GradeEntry) => e.year === year);
  //   console.log(result);
  // }

  // if (evaluation) {
  //   // console.log('Filtering by grade...');
  //   result = result.filter((e: GradeEntry) => e.letter_evaluation === evaluation);
  //   // console.log(result);
  // }

  // if (category) {
  //   // console.log('Filtering by ...');
  //   result = result.filter((e: GradeEntry) => e.category === category);
  //   // console.log(result);
  // }

  // // console.log(result);
  // // console.log('Exiting filterBy()...');
  // return result;

  return undefined
}

/**
 * This functions filters the given grade entry by quarter
 * @params {Array<CourseRecord>} courseGrades - an Array of courseGrades objects
 * @params {number} quarter - 0: returns 前期, 1: returns 後期
 * @returns filtered courseGrades specifies by `quarter` parameter
 */
export function filterQuarter(grade_entry: GradeEntry[] | undefined, quarter: number) {
  // if ((typeof grade_entry === 'undefined') || (grade_entry.length === 0)) {
  //   console.error('Empty input in <filterQuarter(course_grades)>');
  //   return
  // }

  // const FIRSTQUARTER = new Set(['前', '夏学期', '前期集中', '春学期']);
  // const SECONDQUARTER = new Set(['後', '秋学期', '後期集中', '冬学期', '通年']);
  
  // const quarterSelector = typeof quarter === 'undefined' ? null : (quarter === 0 ? ((q:string) => FIRSTQUARTER.has(q)) : ((q:string) => SECONDQUARTER.has(q)));

  // return grade_entry.filter(({ quarter }) => quarterSelector(quarter));
}

export function aggregate(obj?:GradeFilterOptions, planner_table?: PlannerTable) {
  // // - Not including withdrawn
  // const { quarter, year, category } = obj;
  // if (!(year)) console.error('Option is missing `year` key');
  alert("aggregate")

  // const plannerTable = typeof quarter === 'undefined' ? planner_table[year].flat() : planner_table[year][quarter];
  // // console.log(plannerTable, quarter, year, category);


  
  // const grade_statistics = plannerTable
  //   .filter(
  //     (e:GradeEntry | _PlannerTableEntry) => ['A', 'B', 'C', 'D', 'F']
  //       .includes(e.letter_evaluation) || (e as _PlannerTableEntry).isPlan
  //   )// Process only A, B, C, D, F courses
  //   .filter((e:GradeEntry | _PlannerTableEntry) => (typeof (category) === 'string' ? e.category === category : true))
  //   .reduce((agg, e: GradeEntry | _PlannerTableEntry) => {
  //     const { unit, letter_evaluation, gpa } = e as GradeEntry | _PlannerTableEntry
      
  //     // console.log(quarter, year)
  //     // if (quarter ==0 && year == 2023) {
  //     //   console.log(`in DRC.ts, aggregate(): ${e}`)
  //     // }
  //     // if is a plan entry...
  //     if ((e as _PlannerTableEntry).isPlan){
  //       // console.log(`in DRC.ts, aggregate(): is a plan entry ${e}`)
  //       agg.passed_units += unit;
  //       return agg;
  //     }

  //     if (e.subject === '基幹教育セミナー') {
  //       // console.log(gpa === 0 && letter === 'F');
  //     }
  //     if (letter_evaluation === 'R') { // == 'R'
  //       agg[letter_evaluation][0] += unit;
  //       agg.passed_units += unit;
  //     } else if (gpa === 0 && letter_evaluation === 'F') { // == 'F'
  //       agg.total_gpa_units += unit;
  //       agg.F[0] += unit;
  //       // console.log(e['subject'], e['letter_evaluation'])
  //     } else if (['A', 'B', 'C', 'D'].includes(letter_evaluation)) { // == 'A, B, C, D'
  //       const totalGpa = unit * LETTER_TO_GP[letter_evaluation];
  //       agg.total_gpa_units += unit;
  //       agg.total_gpa += totalGpa;
  //       agg.passed_units += unit;
  //       agg[letter_evaluation][0] += unit;
  //       agg[letter_evaluation][1] += totalGpa;
  //     } 
  //     return agg;
  //   }, {
  //     total_gpa_units: 0,
  //     passed_units: 0,
  //     total_gpa: 0,
  //     A: [0, 0],
  //     B: [0, 0],
  //     C: [0, 0],
  //     D: [0, 0],
  //     F: [0, 0],
  //     R: [0, 0],
  //   });

  // const avgGPA = (grade_statistics.total_gpa / grade_statistics.total_gpa_units).toFixed(2);
  // // console.log(grade_statistics);
  // return [avgGPA, grade_statistics.passed_units.toFixed(1)];
}

