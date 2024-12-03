import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { BookController } from './controller/book.controller';
import { BorrowRecordController } from './controller/borrow-record.controller';
import { UserController } from './controller/user.controller';
import { BookService } from './services/book.service';
import { BorrowRecordService } from './services/borrow-record.service';
import { UserService } from './services/user.service';
import { BookModule } from './book/book.module';
import { BorrowRecordModule } from './borrow-record/borrow-record.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        SERVICE_NAME: Joi.string().required(),
        NODE_ENV: Joi.string().required(),
        PORT: Joi.number().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),

        MYSQL_HOST: Joi.string().required(),
        MYSQL_PORT: Joi.number().required(),
        MYSQL_USER: Joi.string().required(),
        MYSQL_PASSWORD: Joi.string().required(),
        MYSQL_DB: Joi.string().required(),

        QUERY_LOG_ENABLE: Joi.boolean().required(),
        MAX_QUERY_RETRY: Joi.number().required(),
      }),
    }),
    AuthModule,
    DatabaseModule,
    UserModule,
    BookModule,
    BorrowRecordModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
