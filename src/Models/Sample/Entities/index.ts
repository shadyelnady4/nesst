import { Entity,Column, BeforeInsert, BeforeUpdate, BaseEntity, ObjectID, CreateDateColumn, ObjectIdColumn } from 'typeorm';
import { IsOptional, IsDefined, IsString, IsNumber , IsDate , IsBoolean } from 'class-validator';
import { ObjectType, Field, Int, ID, InputType, ClassType } from 'type-graphql';
import { Expose, plainToClass } from 'class-transformer';
import { Main_Entity } from '../../Entities';

const add= <T extends ClassType>(B_Cls: T)=> {
  @Entity()
  @ObjectType({ isAbstract: true })
  @InputType({ isAbstract: true })
  abstract class Add extends B_Cls {
    
    @Field(()=>Int,{nullable: true})
    @IsOptional({ always: true })
    @IsNumber()
    @Column({ type: 'number', unique: false})
    @Expose()
    volume?: number
  }
  return Add;
}

@Entity({
  name: `Sample`,
  orderBy: {
    name: 'ASC',
    createdAt: 'ASC',
  },
})
@ObjectType()
@InputType('SampleInput')
export class Sample extends add(Main_Entity(BaseEntity)){
    
  constructor(s: Partial<Sample>) {
    super()
		if (s) {
			Object.assign(
				this,
				plainToClass(Sample, s, {
					excludeExtraneousValues: true
				})
      )
      Object.assign(s, {
        id: 'String',
        createdAt: 'String',
        updatedAt: 'String'
      });

      Object.assign(this, {
        createdAt: (obj, options, context) => { // eslint-disable-line no-unused-vars
          return obj.createdAt || obj.created_at;
        },
        updatedAt: (obj, options, context) => { // eslint-disable-line no-unused-vars
          return obj.updatedAt || obj.updated_at;
        },
        id: (obj, options, context) => { // eslint-disable-line no-unused-vars
          return obj._id || obj.id;
        }
      });
      this.id = this.id || this._id
      this.createdAt= this.createdAt || new Date()
      this.updatedAt= this.updatedAt || new Date()
    }
    
	}
}


