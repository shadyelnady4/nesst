import { Field, Int, ObjectType } from 'type-graphql';
import { Patient } from '../patient/Entities/index.entity';

@ObjectType()
export class Result {
  @Field({nullable: true})
  succes?: boolean;

  @Field(()=>Int,{nullable: true})
  count?: number;

  @Field({nullable: true})
  meassage?: string;

  @Field(()=>[Patient],{nullable: true})
  data?: Patient[];
}