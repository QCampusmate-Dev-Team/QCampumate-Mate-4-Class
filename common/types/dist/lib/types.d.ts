import { SCHOOL, LETTER_EVALUATION } from './Constants';
import { StudentInfo } from './StudentInfo';
import { Course } from './Course';
export interface DegreeRequirementBase {
    meta: StudentInfo;
    req: Req[];
}
interface Req extends _Req {
    school: SCHOOL;
    minFirstYear?: number;
}
export interface LeafReq extends _Req {
    major: string | string[] | undefined;
    matchOptions: MatchOptions;
}
interface _Req {
    label: string;
    minUnit: number;
    children?: _Req[];
    elecComp?: 1 | 2 | 3;
}
export interface MatchOptions {
    mustHas?: MustHasOptions;
    include?: ExIncludeOptions;
    exclude?: ExIncludeOptions;
}
interface MustHasOptions {
    courses?: Course[];
    majors?: string[];
    like?: RegExp;
}
interface ExIncludeOptions {
    like?: RegExp;
    courses?: Course[];
    schools?: SCHOOL[];
    majors?: string[];
}
export interface GradeFilterOptions {
    quarter?: number;
    year?: number;
    evaluation?: LETTER_EVALUATION;
    category?: string;
}
export {};
