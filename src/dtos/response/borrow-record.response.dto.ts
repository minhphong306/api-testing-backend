import { BorrowRecord } from '../../entities/borrow-record.entity';
import { BaseResponseDto } from './base.response.dto';

export class BorrowRecordResponseDto extends BaseResponseDto {
    bookId: number;
    userId: number;
    borrowDate: Date;
    dueDate: Date;
    returnDate?: Date;
    fineAmount: number;
    status: string;
    notes?: string;

    constructor(borrowRecord: BorrowRecord) {
        super();
        Object.assign(this, borrowRecord);
    }
}