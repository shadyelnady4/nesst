import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientResolver } from './patient.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './Entities/index.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient])
  ],
  providers: [PatientService, PatientResolver]
})
export class PatientModule {}
