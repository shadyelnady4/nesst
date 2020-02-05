import { Entity,Column, ObjectID, ObjectIdColumn, BaseEntity } from 'typeorm';
import { ObjectType, Field, Int, ID } from 'type-graphql';

@Entity()
@ObjectType()
export class Patient extends BaseEntity {
  @ObjectIdColumn()
  @Field(()=>ID)
  id: ObjectID

  @Column()
  @Field()
  name: string

  @Column()
  @Field()
  gender: string

  @Column()
  @Field(()=>Int)
  age: number
}