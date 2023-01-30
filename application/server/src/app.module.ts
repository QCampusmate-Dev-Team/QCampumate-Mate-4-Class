import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity'
import { Report } from './reports/report.entity'
import { DegreeRequirement } from './degree-requirements/degree-requirement.entity'
import { DegreeRequirementModule } from './degree-requirements/degree-requirements.module';
import { dataSourceOptions } from '../db/data-source';
import { CoursesModule } from './courses/courses.module';
const cookieSession = require('cookie-session')

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    UsersModule, 
    ReportsModule,
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {
    //     return {
    //       type: 'sqlite',
    //       database: config.get<string>('DB_NAME'),
    //       synchronize: true,
    //       entities: [User, Report]
    //     }
    //   }
    // }),
    // TypeOrmModule.forRoot({ // setting up the connection 
    //   type:'sqlite', 
    //   database: 'db.sqlite', // the file on disk to store data
    //   entities: [User, Report, DegreeRequirement],
    //   synchronize: true
    // }),
    TypeOrmModule.forRoot(dataSourceOptions),
    DegreeRequirementModule,
    CoursesModule
  ], // the list of imported modules that export the providers which are required in(a.k.a dependencies of) this module
  controllers: [AppController],
  providers: [
    AppService,
    {
      // This sets up a global ValidationPipe, but how? 
      // Is this the same as app.useGlobalPipes?
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true
      })
    }
  ],
})
export class AppModule {
  constructor(private config: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
      cookieSession({
        keys:["lasjdlakg"] //[this.config.get('COOKIE_KEY')]
      })
    )
      .forRoutes('*') // apply a global middleware
  }
}
