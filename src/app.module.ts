import { Module } from '@nestjs/common';
import { TypeOrmModule  } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SampleModule } from './Models/Sample/sample.module';
import { DateScalar } from './Models/Utils/scalars';
//import { CustomPKFactory } from './PKFactory'


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
      entities: [join(__dirname,`Models/**/Entities/index.js`)],
      synchronize: true,
      //dropSchema: true,
      //forceServerObjectId: true,
      ignoreUndefined : true,
      appname: 'EL-Nady Lab',
      logging: true,
      logger: 'simple-console',
      
      //pkFactory: CustomPKFactory,
    }),
    GraphQLModule.forRoot({
      debug: false,
      playground: true,
      //buildSchemaOptions:{scalarsMap: [
        //{ type: ObjectId, scalar: MongoIdScalar },
        //{ type: ObjectID, scalar: TypormIdScalar }
      //]},
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      //include: [ SampleModule],              //serve multiple endpoints at once
    }),
    SampleModule
  ],
  controllers: [AppController],
  providers: [
    AppService, DateScalar //,IdScalar //, UploadScalar
  ],
})
export class AppModule {}
