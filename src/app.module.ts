import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenModule } from './authen/authen.module';
import { PublicModule } from './public/public.module';
import { AuthorModule } from './author/author.module';
import { CategoryModule } from './category/category.module';
import { BookModule } from './book/book.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [AuthenModule, PublicModule, AuthorModule, CategoryModule, BookModule, DatabaseModule, UsersModule],
})

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
    DatabaseModule,
    AuthenModule, PublicModule, AuthorModule, CategoryModule, BookModule, DatabaseModule, UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
