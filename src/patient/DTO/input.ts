import { IsOptional, Length, MaxLength } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class Input {
  @Field({nullable: true})
  @MaxLength(30)
  name?: string;

  @Field({nullable: true})
  @IsOptional()
  @Length(1, 255)
  gender?: string;

  @Field(()=>Int,{nullable: true})
  age?: number;
}