import { InputType, ClassType, Field, ObjectType } from 'type-graphql';
import { MinLength } from 'class-validator';

// adds password property with validation to the base, extended class
export default function withPassword<T extends ClassType>(B_Cls: T) {
  @ObjectType({ isAbstract: true })
  @InputType({ isAbstract: true })
  abstract class PasswordTrait extends B_Cls {
    
  }
  return PasswordTrait;
}
