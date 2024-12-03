import { IsDate, IsEnum, IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { BorrowStatus } from '../entities/borrow-record.entity';

export class CreateBorrowRecordDto {
    @IsNumber()
    bookId: number;

    @IsNumber()
    userId: number;

    @IsDate()
    @Type(() => Date)
    borrowDate: Date;

    @IsDate()
    @Type(() => Date)
    dueDate: Date;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    returnDate?: Date;

    @IsNumber()
    @IsOptional()
    @Min(0)
    fineAmount?: number;

    @IsEnum(BorrowStatus)
    status: BorrowStatus;

    @IsString()
    @IsOptional()
    notes?: string;
}

export class UpdateBorrowRecordDto {
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    returnDate?: Date;

    @IsNumber()
    @IsOptional()
    @Min(0)
    fineAmount?: number;

    @IsEnum(BorrowStatus)
    @IsOptional()
    status?: BorrowStatus;

    @IsString()
    @IsOptional()
    notes?: string;
}