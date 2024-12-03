import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book, BookStatus } from '../entities/book.entity';
import { CreateBookDto, UpdateBookDto } from '../dtos/book.dto';
import { BookResponseDto } from '../dtos/response/book.response.dto';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book)
        private bookRepository: Repository<Book>,
    ) { }

    async create(createBookDto: CreateBookDto): Promise<BookResponseDto> {
        // Kiểm tra ISBN có tồn tại chưa
        const existingBook = await this.bookRepository.findOne({
            where: { isbn: createBookDto.isbn }
        });

        if (existingBook) {
            throw new BadRequestException('Book with this ISBN already exists');
        }

        const book = this.bookRepository.create(createBookDto);
        const savedBook = await this.bookRepository.save(book);
        return new BookResponseDto(savedBook);
    }

    async findAll(query: any): Promise<[BookResponseDto[], number]> {
        const queryBuilder = this.bookRepository.createQueryBuilder('book');

        if (query.search) {
            queryBuilder.where('book.title LIKE :search OR book.author LIKE :search OR book.isbn LIKE :search',
                { search: `%${query.search}%` });
        }

        if (query.category) {
            queryBuilder.andWhere('book.category = :category', { category: query.category });
        }

        if (query.status) {
            queryBuilder.andWhere('book.status = :status', { status: query.status });
        }

        queryBuilder
            .skip(query.skip || 0)
            .take(query.take || 10)
            .orderBy(query.orderBy || 'book.createdAt', query.orderDir || 'DESC');

        const [books, total] = await queryBuilder.getManyAndCount();
        return [books.map(book => new BookResponseDto(book)), total];
    }

    async findOne(id: number): Promise<BookResponseDto> {
        const book = await this.bookRepository.findOne({ where: { id } });
        if (!book) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        return new BookResponseDto(book);
    }

    async update(id: number, updateBookDto: UpdateBookDto): Promise<BookResponseDto> {
        const book = await this.findOne(id);
        const updatedBook = await this.bookRepository.save({
            id,
            ...book,
            ...updateBookDto
        } as Book);
        return new BookResponseDto(updatedBook);
    }

    async remove(id: number): Promise<void> {
        const result = await this.bookRepository.softDelete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
    }
}