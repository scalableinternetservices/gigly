import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Listing extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column('price')
  price: number

  @Column('sellingName')
  sellingName: string
}