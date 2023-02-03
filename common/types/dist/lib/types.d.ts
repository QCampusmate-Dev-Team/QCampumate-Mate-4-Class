import type { ComputedRef } from 'vue';
import type { SCHOOL, LETTER_EVALUATION } from './Constants';
import type { StudentInfo } from './StudentInfo';
import type { Course } from './Course';
import type { CompiledLeafReqInterface } from './DRC';
export interface DegreeRequirementBase {
    meta?: StudentInfo;
    req: {
        keg: Req;
        school: Req;
    };
}
export interface Tree {
    label: string;
    children?: Tree[];
}
export interface Req extends Tree {
    minUnit: number;
    passed_units?: number | ComputedRef<number>;
    minFirstYear?: number;
    elecComp?: 1 | 2 | 3;
    children?: (Req | LeafReq)[] | CompiledLeafReqInterface[];
}
export interface LeafReq extends Req {
    major?: string | string[] | undefined;
    matchOptions: MatchOptions;
}
export interface MatchOptions {
    mustHas?: MustHasOptions;
    include?: ExIncludeOptions;
    exclude?: ExIncludeOptions;
}
interface MustHasOptions {
    courses?: Course[];
    majors?: string[];
    like?: RegExp | string;
}
interface ExIncludeOptions {
    like?: RegExp | string;
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
