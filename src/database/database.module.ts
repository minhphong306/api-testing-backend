import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookController } from 'src/controller/book.controller';
import { BorrowRecordController } from 'src/controller/borrow-record.controller';
import { UserController } from 'src/controller/user.controller';
import { Book } from 'src/entities/book.entity';
import { BorrowRecord } from 'src/entities/borrow-record.entity';
import { User } from 'src/entities/user.entity';
import { BookService } from 'src/services/book.service';
import { BorrowRecordService } from 'src/services/borrow-record.service';
import { UserService } from 'src/services/user.service';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get('MYSQL_HOST'),
                port: configService.get('MYSQL_PORT'),
                username: configService.get('MYSQL_USER'),
                password: configService.get('MYSQL_PASSWORD'),
                database: configService.get('MYSQL_DB'),
                entities: [Book, User, BorrowRecord],
                synchronize: true,
                logging: configService.get('QUERY_LOG_ENABLE')
                    ? ['query', 'error']
                    : [],
            }),
        }),
    ],
})
export class DatabaseModule { }
