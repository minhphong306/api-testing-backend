import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus, UseGuards } from '@nestjs/common';
import { BookService } from '../services/book.service';
import { CreateBookDto, UpdateBookDto } from '../dtos/book.dto';
import { BookResponseDto } from '../dtos/response/book.response.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('books')
@Controller('books')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookController {
    constructor(private readonly bookService: BookService) { }

    @Post()
    @ApiOperation({ summary: 'Create new book' })
    @ApiResponse({ status: HttpStatus.CREATED, type: BookResponseDto })
    @Roles(Role.LIBRARIAN, Role.ADMIN)
    async create(@Body() createBookDto: CreateBookDto): Promise<BookResponseDto> {
        return this.bookService.create(createBookDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all books with pagination and filters' })
    @ApiResponse({ status: HttpStatus.OK, type: [BookResponseDto] })
    async findAll(@Query() query: any): Promise<{ data: BookResponseDto[]; total: number }> {
        const [books, total] = await this.bookService.findAll(query);
        return {
            data: books,
            total
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get book by id' })
    @ApiResponse({ status: HttpStatus.OK, type: BookResponseDto })
    async findOne(@Param('id') id: number): Promise<BookResponseDto> {
        return this.bookService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update book' })
    @ApiResponse({ status: HttpStatus.OK, type: BookResponseDto })
    @Roles(Role.LIBRARIAN, Role.ADMIN)
    async update(
        @Param('id') id: number,
        @Body() updateBookDto: UpdateBookDto,
    ): Promise<BookResponseDto> {
        return this.bookService.update(id, updateBookDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete book' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    @Roles(Role.ADMIN)
    async remove(@Param('id') id: number): Promise<void> {
        await this.bookService.remove(id);
    }
}