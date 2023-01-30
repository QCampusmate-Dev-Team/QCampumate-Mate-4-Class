import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class School {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  code: string // "e.g. DES in 'DES-IND"

  @Column()
  name: string // "e.g. 芸術工学部"
}