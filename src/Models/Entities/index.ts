import { Entity,Column, ObjectID, ObjectIdColumn, BaseEntity, BeforeInsert, BeforeUpdate, BeforeRemove,
UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { IsOptional, IsDefined, IsString, IsNumber , IsMongoId , IsDate , IsBoolean } from 'class-validator';
import { ObjectType, Field, Int, ID, ClassType, InputType } from 'type-graphql';
import { Expose, plainToClass,  } from 'class-transformer';
import { IdScalar } from '../Utils/scalars/id.scalar';

export const Main_Entity= <T extends ClassType>(B_Cls: T)=> {
  @Entity()
  @ObjectType({ isAbstract: true })
  @InputType({ isAbstract: true })
  abstract class Class_Entity extends B_Cls {
    @Field(()=>ID,{nullable: true})
    @IsOptional({ always: true })
    @ObjectIdColumn({name: '_id'})
    @Expose()
    id?: ObjectID

    @Field(()=>Date,{nullable: true})
    @IsOptional({ always: true })
    @IsDate()  
    @Column()
    @Expose()
    createdAt?: Date
    
    @Field(()=>Date,{nullable: true})
    @IsOptional({ always: true })
    @IsDate() 
    @Column()
    @Expose()
    updatedAt?: Date

    @BeforeInsert()
    b_I(){
      this.createdAt= new Date()
    }

    @BeforeUpdate()
    b_U(){
      this.updatedAt= new Date()
    }

    @Field(()=>String,{nullable: true})
    @IsOptional({ groups: ['update']})
    @IsString()
    @Column({unique: true})
    @Expose()
    name?: string
  }
  return Class_Entity as any
}
