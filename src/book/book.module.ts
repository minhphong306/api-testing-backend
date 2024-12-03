import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookController } from 'src/controller/book.controller';
import { Book } from 'src/entities/book.entity';
import { BookService } from 'src/services/book.service';

@Module({
    imports: [TypeOrmModule.forFeature([Book])],
    controllers: [BookController],
    providers: [BookService],
    exports: [BookService]
})
export class BookModule { }
