import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Major {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  code: string // "e.g. IND in 'DES-IND'"

  @Column()
  name: string // "e.g. 芸術工学部　インダストリアルデザインコース　Industrial Design Course"

  @Column()
  school_id: number // "schools.id"
}