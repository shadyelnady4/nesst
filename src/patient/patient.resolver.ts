import { Resolver } from '@nestjs/graphql';
import { Patient } from './Entities/index.entity';
import { PatientService } from './patient.service';
import { Args, Query, Mutation } from '@nestjs/graphql';
import { Input } from './DTO/input';
import { Result } from '../Utils/type';

@Resolver(of=>Patient)
export class PatientResolver {
  constructor(
    private readonly P_Service: PatientService
  ){}
  @Query(returns => [Patient])
  async get_patients(): Promise<Patient[]>{
    return this.P_Service.getAll();
  }
  @Query(returns => Patient)
  async get_ById(@Args('id') id: string): Promise<Patient>{
    return await this.P_Service.getById(id);
  }
  @Query(returns =>Result)
  async get_count(@Args('obj') obj?: Input): Promise<Result>{
    return await this.P_Service.get_count(obj);
  }
  @Query(returns => [Patient])
  async get_ByObj(@Args('obj') obj: Input): Promise<Patient[]>{
    return await this.P_Service.getOne(obj);
  }
  @Mutation(returns => Patient)
  async creat_patient(@Args({name: 'data',type: ()=>Input}) data: Input): Promise<Patient>{
    return  await this.P_Service.createPatient(data);
  }
  @Mutation(returns => Result)
  async delete_patient(@Args('id') id: string): Promise<Result>{
    return  await this.P_Service.deletePatient(id);
  }
    
}
