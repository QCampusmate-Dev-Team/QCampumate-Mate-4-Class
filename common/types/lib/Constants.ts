export type SCHOOL = 
"KED"| //基幹・大学院基幹
"LET"| // 文 
"ISI"| //共創
"EDU"| //教育学部・教職課程
"LAW"| //法学
"ECO"| //経済
"MED"| //医学部医学科・医学部生命科学科・医学部保健学科
"DEN"| //歯
"PHS"| //薬
"ENG"| //工
"DES"| //芸工
"AGR"| //農
""|
undefined;

export type LETTER_EVALUATION = 'S' | 'A' | 'B' | 'C' | 'D' | 'F' | 'W' | 'R' | '' | undefined; // change this to enum and get rid of gpa?
export type QUARTER = '前期' | '前' | '夏学期' | '前期集中' | '春学期' | '後期' | '後' | '秋学期' | '後期集中' | '冬学期' | '通年' | 0 | 1 | undefined;

export const data = "data science"