import { CustomScalar, Scalar } from '@nestjs/graphql';
import { GraphQLScalarType, Kind, GraphQLID } from 'graphql';
import { ObjectID } from 'typeorm';

@Scalar('ObjectID', type => ObjectID)
export class IdScalar implements CustomScalar<string, ObjectID > {
  description = 'TypeORM Id custom scalar type';

  parseValue(value: string): ObjectID {
    const a= new ObjectID(value);
    console.log('parseValue from Client:',a);
    return a;         // value from the client
  }

  serialize(value: ObjectID): string {
    const b= value.toHexString();
    console.log('serialize to Client:',b)
    return b;         // value sent to the client 
  }

  parseLiteral(ast: any) {
    if (ast.kind === Kind.STRING) {
      console.log(ast)
      const c= new ObjectID(ast.value);
      console.log('parseLiteral from Client Query:',c);
      return c; // value from the client query
    }
    return null;
  }
}

/*
export const TypormIdScalar = new GraphQLScalarType({
  name: "ObjectID",
  description: "TypeORM object id scalar type",
  parseValue(value: string) {
    return new ObjectID(value); // value from the client input variables
  },
  serialize(value: ObjectID) {
    return value.toHexString(); // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new ObjectID(ast.value); // value from the client query
    }
    return null;
  },
});

export const MongoIdScalar = new GraphQLScalarType({
  name: "ObjectId",
  description: "Mongo object id scalar type",
  parseValue(value: string) {
    return new ObjectId(value); // value from the client input variables
  },
  serialize(value: ObjectId) {
    return value.toHexString(); // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new ObjectId(ast.value); // value from the client query
    }
    return null;
  },
});

*/