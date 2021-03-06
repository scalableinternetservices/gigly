import { int } from 'aws-sdk/clients/datapipeline'
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Comment } from './Comment'
import { Tag } from './Tag'
import { User } from './User'

@Entity()
export class Listing extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column({ type: 'int', name: 'price', nullable: true })
  price: int | null

  @Column()
  sellingName: string

  @Column()
  startDate: string

  @Column()
  endDate: string

  @Column()
  location: string

  @Column()
  description: string

  @Column()
  image: string

  @ManyToOne(() => User, user => user.listings)
  @JoinColumn({ name: 'userId' })
  user: User

  //probably not what we want to do but idk how to do the resolver decoupling thing yet
  @Column()
  userId_ref: number

  @OneToMany(() => Comment, comment => comment.listing)
  @JoinColumn({ name: 'commentId' })
  comments: Comment[]

  @OneToMany(() => Tag, tag => tag.listing)
  @JoinColumn({ name: 'tagId' })
  tags: Tag[]
}
