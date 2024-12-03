import { Controller, Get, Post, Put, Body, Param, Query, HttpStatus } from '@nestjs/common';
import { BorrowRecordService } from '../services/borrow-record.service';
import { CreateBorrowRecordDto, UpdateBorrowRecordDto } from '../dtos/borrow-record.dto';
import { BorrowRecordResponseDto } from '../dtos/response/borrow-record.response.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('borrow-records')
@Controller('borrow-records')
export class BorrowRecordController {
    constructor(private readonly borrowRecordService: BorrowRecordService) { }

    @Post()
    @ApiOperation({ summary: 'Create new borrow record' })
    @ApiResponse({ status: HttpStatus.CREATED, type: BorrowRecordResponseDto })
    async create(
        @Body() createBorrowRecordDto: CreateBorrowRecordDto,
    ): Promise<BorrowRecordResponseDto> {
        return this.borrowRecordService.create(createBorrowRecordDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all borrow records with pagination and filters' })
    @ApiResponse({ status: HttpStatus.OK, type: [BorrowRecordResponseDto] })
    async findAll(@Query() query: any): Promise<{ data: BorrowRecordResponseDto[]; total: number }> {
        const [records, total] = await this.borrowRecordService.findAll(query);
        return {
            data: records,
            total
        };
    }

    @Put(':id/return')
    @ApiOperation({ summary: 'Return book' })
    @ApiResponse({ status: HttpStatus.OK, type: BorrowRecordResponseDto })
    async returnBook(
        @Param('id') id: number,
        @Body() updateBorrowRecordDto: UpdateBorrowRecordDto,
    ): Promise<BorrowRecordResponseDto> {
        return this.borrowRecordService.returnBook(id, updateBorrowRecordDto);
    }
}