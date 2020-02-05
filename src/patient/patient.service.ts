import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './Entities/index.entity';
import { MongoRepository, InsertResult } from 'typeorm';
import { Result } from '../Utils/type';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patient_repo: MongoRepository<Patient>
  ){}

  async createPatient(data: Partial<Patient>): Promise<Patient>{
    const p = this.patient_repo.create(data);
    const result = await this.patient_repo.save(p);
    console.log("result Create : ", result);
    return result;
  }
  async deletePatient(id: string){
    const result = await this.patient_repo.delete(id);
    console.log("result Insert : ", result.raw);
    const result_Obj ={
      succes: true,
      //count: result[1],
      meassage: `fond `,
      //data: result[0]
    };
    console.log("result_Obj : ", result_Obj);
    return result_Obj;
  }

  async getAll(): Promise<Patient[]>{
    const result = await this.patient_repo.find();
    console.log("result find : ", result);
    return result;
  }
  async getById(id: string): Promise<Patient>{
    const result = await this.patient_repo.findOne(id);
    console.log("result findOne : ", result);
    return result;
  }
  async get_count(Obj?: Partial<Patient>): Promise<Result>{
    const result = await this.patient_repo.findAndCount(Obj);
    console.log("result find By Ids : ", result);
    const result_Obj ={
      succes: true,
      count: result[1],
      meassage: `fond ${result[1]}`,
      data: result[0]
    };
    console.log("result_Obj : ", result_Obj);
    return result_Obj;
  }
  async getOne(obj: Partial<Patient>): Promise<Patient[]>{
    const result = await this.patient_repo.find(obj);
    console.log("result find By Patial Patient : ", result);
    return result;
  }
}
