import { Resolver, Args, Query, Mutation, Root } from '@nestjs/graphql';
import { ID, ClassType, InputType, Field, ObjectType, Int, ArgsType, InterfaceType } from 'type-graphql';
import { InjectRepository, InjectEntityManager, InjectConnection } from '@nestjs/typeorm';
import { ObjectID, MongoRepository, DeepPartial, MongoError, Connection, FindManyOptions, FindOneOptions, FindConditions, ObjectLiteral } from 'typeorm';

const FIND= 'FIND';
const CREATE= 'CREATE';
const INSERT= 'INSERT';
const UPDATE= 'UPDATE';
const REPLACE= 'REPLACE';
const DELETE= 'DELETE';
const REMOVE= 'REMOVE'

@InputType(`Op_R`)
class Op_R {
  @Field(()=>[ID],{nullable: true})
  InsertedIds: ObjectID[]

  @Field(()=>Int,{nullable: true})
  InsertedCount: number

  @Field(()=>Int,{nullable: true})
  MatchedCount: number

  @Field(()=>Int,{nullable: true})
  ModifiedCount: number

  @Field(()=>Int,{nullable: true})
  DeletedCount: number
    
}

@InputType()
abstract class JoinOptions {

  /**
   * Alias of the main entity.
   */
  @Field(()=>String,{nullable: true})
  alias?: string;

  /**
   * Array of columns to LEFT JOIN.
   */
  @Field(()=>String,{nullable: true})
  leftJoinAndSelect?: { [key: string]: string };

  /**
   * Array of columns to INNER JOIN.
   */
  @Field(()=>String,{nullable: true})
  innerJoinAndSelect?: { [key: string]: string };

  /**
   * Array of columns to LEFT JOIN.
   */
  @Field(()=>String,{nullable: true})
  leftJoin?: { [key: string]: string };

  /**
   * Array of columns to INNER JOIN.
   */
  @Field(()=>String,{nullable: true})
  innerJoin?: { [key: string]: string };

}


export function ResourceResolver<T extends ClassType>( E_Cls: T){

  const Name = E_Cls.name.toLocaleLowerCase();

  @ObjectType(`Object_${Name}`)
  class Obj extends E_Cls {}

  @InputType(`Input_${Name}`)
  class I extends E_Cls {}

  @InputType(`I_Q_U_${Name}`)
  class IQU{
    @Field(()=>I,{nullable:true})
    Query?: I

    @Field(()=>I,{nullable:true})
    Update?: I
  }

  @ObjectType(`Error_${Name}`)
  class Error{
    @Field(()=>Obj, {nullable: true})
    Element?: Obj

    @Field(()=>String,{nullable: true})
    message?: string
  }

  @ObjectType(`H_${Name}Result`)
  class Return_Object{
    @Field(()=>[Obj],{nullable: true})
    Succes?: Obj[]

    @Field(()=>[Error],{nullable: true})
    Failed?: Error[]
  }

  @ObjectType(`${Name}_Result`)
  class Result {
    @Field(()=>String,{nullable: true})
    method?: string

    @Field(()=>String,{nullable: true})
    succes?: string

    @Field(()=>Int,{nullable: true})
    succes_Count?: number

    @Field(()=>[Obj],{nullable: true})
    succes_Data?: Obj[]
    
    @Field(()=>Int,{nullable: true})
    errors_Count?: number

    @Field(() => [Error],{nullable: true})
    errors?: Error[]

    @Field(()=>[ID],{nullable: true})
    InsertedIds?: ObjectID[]

    @Field(()=>Int,{nullable: true})
    InsertedCount?: number

    @Field(()=>Int,{nullable: true})
    MatchedCount?: number
    
    @Field(()=>Int,{nullable: true})
    ModifiedCount?: number

    @Field(()=>Int,{nullable: true})
    DeletedCount?: number
  }

  @InputType(`SearchInput${Name}`)
  class SearchInput<E_Cls> {
    @Field(()=>[String],{nullable: true})
    select?: (keyof E_Cls)[]   //Specifies what columns should be retrieved.

    @Field(()=>E_Cls, {nullable: true})
    where?: Partial<E_Cls>|FindConditions<E_Cls>[]|FindConditions<E_Cls>|ObjectLiteral|string

    @Field(()=>Int,{nullable: true})
    start?: number

    @Field(()=>Int,{nullable: true})
    end?: number

    @Field(()=>E_Cls, {nullable: true})
    order?:  { [P in keyof E_Cls]?: "ASC"|"DESC"|1|-1 }      //Order, in which entities should be ordered.

    @Field(()=>Int,{nullable: true})
    skip?: number         //Offset (paginated) where from entities should be taken

    @Field(()=>Int,{nullable: true})
    take?: number       //Limit (paginated) - max number of entities should be taken.

    @Field(()=>Boolean, {nullable: true})
    cache?: boolean | number | { id: any, milliseconds: number }

    @Field(()=>Int, {nullable: true})
    lock?: { mode: "optimistic", version: number|Date } | { mode: "pessimistic_read"|"pessimistic_write"|"dirty_read" }; //used only in findOne method

    @Field(()=>[String], {nullable: true})
    relations: string[]    // Indicates what relations of entity should be loaded (simplified left join form).
    
    @Field({nullable: true})
    loadRelationIds?: boolean//|{ relations?: string[], disableMixedMap?: boolean }; // todo: extract options into separate interface, reuse
        //If sets to true then loads all relation ids of the entity and maps them into relation values (not relation objects). If array of strings is given then loads only relation ids of the given properties
        
    @Field(()=>Boolean, {nullable: true})
    loadEagerRelations: boolean     //  Indicates if eager relations should be loaded or not. By default they are loaded when find methods are used.
    
    @Field({nullable: true})
    join: JoinOptions             //Specifies what relations should be loaded.
  
  }

  const h_Result= (method: string, su?: I[] , err?: Error[] ,op?: Op_R 
    ): Result =>({
    method,
    succes_Count: su ? su.length : 0,
    succes_Data: su || null,
    succes: su ? `${method} ${su.length} element` : null,
    errors_Count: err ? err.length : 0,
    errors: err || null,
    InsertedIds: op===undefined ? (method===CREATE || method===INSERT ? ["su.map(e=>e.id)"] : []) : (op.InsertedIds===undefined ? (method===CREATE || method===INSERT ? su.map(e=>e.id) : [] ) : op.InsertedIds),
    InsertedCount: op===undefined ? (method===CREATE || method===INSERT  ? su.length : 0) : (op.InsertedCount===undefined ? (method===CREATE || method===INSERT ? su.length : 0 ) : op.InsertedCount),
    //MatchedCount: op===undefined ? (method!==FIND ? su.length : 0) : (op.MatchedCount===undefined ? (method!==FIND ? su.length : 0 ) : op.MatchedCount),
    ModifiedCount: op===undefined ? (method===UPDATE || method===REPLACE ? su.length : 0) : (op.ModifiedCount===undefined ? (method===UPDATE || method===REPLACE ? su.length : 0 ) : op.ModifiedCount),
    DeletedCount: op===undefined ? (method===DELETE || method===REMOVE ? su.length : 0) : (op.DeletedCount===undefined ? (method===DELETE || method===REMOVE ? su.length : 0 ) : op.DeletedCount)
  })

  const N_F=(a: Obj,m?: string): Error=>{
    return ({
      Element: a,
      message: m ||`NOT FOUND`
    })
  }
    
  @Resolver(of => E_Cls, { isAbstract: true })
  abstract class ResolverCls {
    constructor(@InjectConnection() private connection: Connection){}

    R= this.connection.getMongoRepository(E_Cls);

    H_Find= async (p?: any,o?: any)=>{
      let Es: Obj[]= new Array() 
      let Ers: Error[]= new Array()
      switch(typeof(p)){
        case 'string':
        case 'number':
          const E= await this.R.findOne(p,o);
          if(!E){Ers.push(N_F({id: p}))}else{Es.push(E)}
          break;
        case 'object':
          if(!Array.isArray(p)){
            if(p.id!==undefined){
              const El= await this.H_Find(p.id,o)
              Es= [ ...Es, ...El.Es]
              Ers= [ ...Ers, ...El.Ers]
            }else{
              const Els= await this.R.find(p)
              if(Els[0]===undefined){Ers.push(N_F(p))}else{Es= [...Es, ...Els]}
            }
          }else{
            for(let A of p){
              const a= await this.H_Find(A,o)
              Es= [ ...Es, ...a.Es]
              Ers= [ ...Ers, ...a.Ers]
            }
          }
          break;
        case 'undefined':
        
          const Els= await this.R.find(o)
          if(Els[0]===undefined){Ers.push(N_F(p))}else{Es= [...Es, ...Els]}
          break;
        default:
          break;
      }
      return {Es, Ers}
    }

    H_Create= async (data: I[])=>{
      let R_Object: Return_Object= {Succes: new Array(), Failed: new Array()}
      const { Succes, Failed } = R_Object
        for(let x of data){
          await this.R.save(this.R.create(x)).then(T=>{
            Succes.push(T)
          }).catch(({name,errmsg , op})=>{
            Failed.push( N_F({ ...op, id: op._id},name+` : `+errmsg))
          })
        }
        return R_Object;    
    }

    H_Insert= async (data: I[])=>{
      let Succes: Obj[]= new Array()
      let Failed: Error[]= new Array()
      for(let E of data){
        await this.R.insertMany([{ ...E,createdAt: new Date() }]).then(({ops, insertedCount})=>{
          if(insertedCount>=1){
            Succes.push({ ...ops[0], id: ops[0]._id})
          }else{
            Failed.push( N_F(E,`FAILED INSERT`) )
          }
        }).catch(({name, errmsg, op })=>{
          Failed.push( N_F({ ...op, id: op._id},name+` : `+errmsg) )
        })
      }
      return h_Result(INSERT,Succes, Failed)
    }

    H_Delete= async x=>{
      const {Es, Ers} = await this.H_Find(x)
      for(let E of Es){
        await this.R.delete(E)
      }
      return h_Result(DELETE, Es, Ers)
    }

    H_Update= async ({Query,Update}: IQU)=>{
      const {Es, Ers} = await this.H_Find(Query)
      Update= {...Update,updatedAt: new Date()}
      for(let E of Es){
        await this.R.update(E,Update)
      }
      return h_Result(DELETE, Es, Ers)
    }

    //               Find
    @Query(returns => Result, { name: `${Name}ById` })
    async findById(
      @Args({name: "id", type: () => ID}) id: ObjectID,
      @Args({name: "FindOneOptions", nullable: true, type: () => SearchInput}) option: FindOneOptions
      ){
      const{Es, Ers} = await this.H_Find(id,option)
      return h_Result(FIND,Es,Ers)
    }

    @Query(returns => Result, { name: `${Name}` })
    async findOne(
      @Args({name: "Query", type: () => I}) Query: I,
      @Args({name: "FindOneOptions", nullable: true, type: () => SearchInput}) option: FindOneOptions
      ){
      const{Es, Ers} = await this.H_Find(Query,option)
      return h_Result(FIND,Es,Ers)
    }

    @Query(returns => Result, { name: `${Name}s` })
    async findAll(
      @Args({name:'FindManyOptions', nullable: true, type:()=>SearchInput}) option?: FindManyOptions
    ) {
      const{Es, Ers} = await this.H_Find(undefined,option)
      return h_Result(FIND,Es,Ers)
    }
    //                      Create
    @Mutation(returns => Result, { name: `Create_${Name}` })
    async create(@Args({name: `${Name}`, type: () => I}) data: I){
      const {Succes, Failed}= await this.H_Create([data]);
      return h_Result(CREATE,Succes, Failed)      
    }

    @Mutation(returns => Result, { name: `Create_${Name}S` })
    async createM(@Args({name: `${Name}s_Array`, type: () => [I]}) data_A: I[]){
      const {Succes, Failed}= await this.H_Create(data_A);
      return h_Result(CREATE,Succes, Failed)      
    }
    //                       Insert
    @Mutation(returns => Result, { name: `Insert_${Name}` })
    async insert(@Args({name: `${Name}`, type: () => I}) data: I){
      return await this.H_Insert([data])
    }

    @Mutation(returns => Result, { name: `Insert_${Name}s` })
    async insertM(@Args({name: `${Name}s_Array`, type: () => [I]}) data_A: I[]){
      return await this.H_Insert(data_A)
    }
    //                        Update
    @Mutation(returns => Result, { name: `Update_${Name}` })
    async update(
      @Args({name: "QU_Update", type: () => IQU}) QU_Update: IQU
      ){
      return await this.H_Update(QU_Update)
    }
    //                Update By Create
    @Mutation(returns => Result, { name: `UpByCre_${Name}` })
    async updateByCreate(
        @Args({name: "QU_Update", type: () => IQU}) {Query, Update}: IQU
      ){
        const {Es, Ers}= await this.H_Find(Query);
        const {Succes, Failed}= await this.H_Create(Es.map(e=>({...e, ...Update})));
      return h_Result(CREATE,Succes, [...Failed, ...Ers])
    }

    @Mutation(returns => Result, { name: `UpsByCre_${Name}s` })
    async updatesByCreate(
        @Args({name: "QU_UpArray", type: () => [IQU]}) QU_Data: IQU[]
      ){
        let err: Error[]= new Array();
        let Els: Obj[]= new Array();
        for(let x of QU_Data){
          const {Query, Update}= x;
          const {Es, Ers}= await this.H_Find(Query);
          const {Succes, Failed}= await this.H_Create(Es.map(e=>({...e, ...Update})));
          err= [ ...err,...Ers, ...Failed]
          Els=[ ...Els, ...Succes]
        }
      return h_Result(CREATE,Els, err)
    }
    
    //                                        Delete
    @Mutation(returns => Result, { name: `Del_${Name}ById` })
    async deleteId(@Args({name: "id", type: () => ID}) id: ObjectID){
      return await this.H_Delete(id)
    }

    @Mutation(returns => Result, { name: `Del_${Name}sByIds` })
    async deleteIds(@Args({name: "ids_Array", type: () => [ID]}) ids: ObjectID[]){
      return await this.H_Delete(ids)
    }

    @Mutation(returns => Result, { name: `Del_${Name}` })
    async delete(@Args({name: `${Name}`, type: () => I}) data: I){
      return await this.H_Delete(data)
    }

    @Mutation(returns => Result, { name: `DelM_${Name}S` })
    async deleteM(@Args({name: `${Name}s_Array`, type: () => [I]}) data: I[]){
      await this.H_Delete(data)
    }
  }
  return ResolverCls as any;
}
