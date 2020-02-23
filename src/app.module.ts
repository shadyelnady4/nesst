import { Module } from '@nestjs/common';
import { TypeOrmModule  } from '@nestjs/typeorm';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientModule } from './patient/patient.module';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //username: 'root',
      //password: 'root',
      database: 'nesst',
      entities: [join(__dirname,`**/Entities/*{.ts,.js}`)],
      synchronize: true,
    }),
    GraphQLModule.forRoot({
      debug: false,
      playground: true,
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
    }),
    PatientModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
