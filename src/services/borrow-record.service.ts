import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BorrowRecord, BorrowStatus } from '../entities/borrow-record.entity';
import { CreateBorrowRecordDto, UpdateBorrowRecordDto } from '../dtos/borrow-record.dto';
import { BorrowRecordResponseDto } from '../dtos/response/borrow-record.response.dto';
import { BookService } from './book.service';
import { UserService } from './user.service';
import { BookStatus } from '../entities/book.entity';
import { UserStatus } from '../entities/user.entity';

@Injectable()
export class BorrowRecordService {
    constructor(
        @InjectRepository(BorrowRecord)
        private borrowRecordRepository: Repository<BorrowRecord>,
        private bookService: BookService,
        private userService: UserService,
    ) { }

    async create(createBorrowRecordDto: CreateBorrowRecordDto): Promise<BorrowRecordResponseDto> {
        // Kiểm tra book và user
        const book = await this.bookService.findOne(createBorrowRecordDto.bookId);
        const user = await this.userService.findOne(createBorrowRecordDto.userId);

        // Kiểm tra trạng thái sách
        if (book.status !== BookStatus.AVAILABLE) {
            throw new BadRequestException('Book is not available for borrowing');
        }

        // Kiểm tra tư cách thành viên
        if (user.status !== UserStatus.ACTIVE) {
            throw new BadRequestException('User membership is not active');
        }

        // Kiểm tra số sách đang mượn
        const activeLoans = await this.borrowRecordRepository.count({
            where: {
                user: { id: user.id },
                status: BorrowStatus.BORROWED,
            },
        });

        if (activeLoans >= 5) {
            throw new BadRequestException('User has reached maximum number of active loans');
        }

        const borrowRecord = this.borrowRecordRepository.create(createBorrowRecordDto);
        const savedRecord = await this.borrowRecordRepository.save(borrowRecord);

        // Cập nhật trạng thái sách
        await this.bookService.update(book.id, { status: BookStatus.BORROWED });

        return new BorrowRecordResponseDto(savedRecord);
    }

    async findAll(query: any): Promise<[BorrowRecordResponseDto[], number]> {
        const queryBuilder = this.borrowRecordRepository
            .createQueryBuilder('borrowRecord')
            .leftJoinAndSelect('borrowRecord.book', 'book')
            .leftJoinAndSelect('borrowRecord.user', 'user');

        if (query.userId) {
            queryBuilder.andWhere('borrowRecord.userId = :userId', { userId: query.userId });
        }

        if (query.status) {
            queryBuilder.andWhere('borrowRecord.status = :status', { status: query.status });
        }

        if (query.overdue) {
            queryBuilder.andWhere('borrowRecord.dueDate < :now AND borrowRecord.status = :status', {
                now: new Date(),
                status: BorrowStatus.BORROWED,
            });
        }

        queryBuilder
            .skip(query.skip || 0)
            .take(query.take || 10)
            .orderBy(query.orderBy || 'borrowRecord.createdAt', query.orderDir || 'DESC');

        const [records, total] = await queryBuilder.getManyAndCount();
        return [records.map(record => new BorrowRecordResponseDto(record)), total];
    }

    async returnBook(id: number, updateBorrowRecordDto: UpdateBorrowRecordDto): Promise<BorrowRecordResponseDto> {
        const borrowRecord = await this.borrowRecordRepository.findOne({
            where: { id },
            relations: ['book'],
        });

        if (!borrowRecord) {
            throw new NotFoundException(`Borrow record with ID ${id} not found`);
        }

        if (borrowRecord.status === BorrowStatus.RETURNED) {
            throw new BadRequestException('Book has already been returned');
        }

        // Tính tiền phạt nếu trả muộn
        if (new Date() > borrowRecord.dueDate) {
            const daysLate = Math.ceil(
                (new Date().getTime() - borrowRecord.dueDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            borrowRecord.fineAmount = daysLate * 1000; // 1000 VND per day
        }

        borrowRecord.returnDate = new Date();
        borrowRecord.status = BorrowStatus.RETURNED;
        const savedRecord = await this.borrowRecordRepository.save(borrowRecord);

        // Cập nhật trạng thái sách
        await this.bookService.update(borrowRecord.book.id, { status: BookStatus.AVAILABLE });

        return new BorrowRecordResponseDto(savedRecord);
    }
}