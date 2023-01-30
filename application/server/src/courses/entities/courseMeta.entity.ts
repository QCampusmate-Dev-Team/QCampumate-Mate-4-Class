import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class CourseMeta {
  @PrimaryGeneratedColumn()
  id: number

  @Column("smallint") 
  school_id: number // FK

  @Column("smallint")
  major_id: number // FK

  @Column()
  subjectName: string // "e.g. インダストリアルデザイン基礎Ⅰ; NULL is not allowed;"

  @Column()
  subjectCode: string // "e.g. 1111J in 'DES-IND1111J'"

  @Column("real")
  unit: number // "e.g. 1; NULL is not allowed;"

  @Column("")
  category: string //"e.g. コース基礎科目　Course Fundamental Subjects"

  @Column()
  target_year: string //"e.g. 学部1年　Undergraduate first grade"   varchar150 

  @Column()
  elecCompul: string // "e.g. 選択必修　Required elective" varchar90 

  @Column()
  quarter: string // "e.g. '前期'" varchar30 
}