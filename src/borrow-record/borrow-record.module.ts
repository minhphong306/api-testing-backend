import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookModule } from 'src/book/book.module';
import { BorrowRecordController } from 'src/controller/borrow-record.controller';
import { BorrowRecord } from 'src/entities/borrow-record.entity';
import { BorrowRecordService } from 'src/services/borrow-record.service';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([BorrowRecord]),
        UserModule,
        BookModule,
    ],
    controllers: [BorrowRecordController],
    providers: [BorrowRecordService],
})
export class BorrowRecordModule { }
