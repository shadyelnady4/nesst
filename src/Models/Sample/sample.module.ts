import { Module } from '@nestjs/common';
import { SampleResolver } from './sample.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Sample } from './Entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sample])
  ],
  providers: [ SampleResolver ]
})
export class SampleModule {}
