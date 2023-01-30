import { AfterInsert, BeforeRemove, AfterUpdate, Entity, Column, PrimaryColumn } from 'typeorm'

@Entity()
export class Course {
  @PrimaryColumn()
  id: number // "講義コード"

  // @Column("") this should be foreign key
  courseMeta_id: number //"ONE courseMeta has MANY courses"

  @Column()
  title: string // ""

  @Column("timestamp")
  timestamp: Date //updated_at "e.g. 2021/05/25 22:18"

  @Column({ 
    type: "text", 
    array: true,     
    default: [] })
  instructors: string[] // "e.g. ['秋田　直繁', '清須美　匡洋'...]"

  @Column()
  lang: string //"e.g. 日本語（J)"
  
  @Column("smallint")
  year: number //"e.g. 2021"

  @Column("varchar", { length: 30 })
  quarter:string // "e.g. 前期"

  @Column("json", { nullable: true })
  day_time: Object  // "e.g. [['火曜日', '3時限']]" array2D-of-text 

  @Column()
  classroom: string // "e.g. 未定/　TBA"

  @Column("varchar",{ length: 30 } )
  area: string // "e.g. 伊都地区"

  @Column("varchar",{ length: 30 } )
  more: string
  
  @Column("json", { nullable: true })  
  syllabusOrCourseDetail: Object //"postgres doesn't care about the internal structure; naming is for documentation consistency(for now)"

  @Column("json", { nullable: true })  
  syllabus: Object //"Each course record will have either syllabus or courseDetail, with the other left to be NULL"

  @Column("json", { nullable: true })  
  courseDetail: Object
}
