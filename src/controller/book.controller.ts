import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus, UseGuards } from '@nestjs/common';
import { BookService } from '../services/book.service';
import { CreateBookDto, UpdateBookDto } from '../dtos/book.dto';
import { BookResponseDto } from '../dtos/response/book.response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { BookStatus } from 'src/entities/book.entity';

@ApiTags('Quản lý sách')
@Controller('books')
export class BookController {
    constructor(private readonly bookService: BookService) { }

    @Post()
    @ApiOperation({ summary: 'Tạo sách mới' })
    @ApiBody({
        description: 'Thông tin sách cần tạo',
        type: CreateBookDto,
        examples: {
            example1: {
                value: {
                    title: 'Clean Code',
                    author: 'Robert C. Martin',
                    isbn: '9780132350884',
                    publishYear: 2008,
                    publisher: 'Prentice Hall',
                    status: "available",
                    category: 'Programming',
                    location: 'A1-01',
                    quantity: 5,
                    description: 'Sách về kỹ thuật viết code sạch',
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Tạo sách thành công',
        type: BookResponseDto,
        content: {
            'application/json': {
                example: {
                    id: 1,
                    title: 'Clean Code',
                    author: 'Robert C. Martin',
                    isbn: '9780132350884',
                    publishYear: 2008,
                    publisher: 'Prentice Hall',
                    category: 'Programming',
                    location: 'A1-01',
                    status: 'available',
                    quantity: 5,
                    description: 'Sách về kỹ thuật viết code sạch',
                    createdAt: '2024-03-12T08:00:00.000Z',
                    updatedAt: '2024-03-12T08:00:00.000Z'
                }
            }
        }
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.LIBRARIAN, Role.ADMIN)
    async create(@Body() createBookDto: CreateBookDto): Promise<BookResponseDto> {
        return this.bookService.create(createBookDto);
    }

    @Get()
    @ApiOperation({ summary: 'Lấy danh sách sách' })
    @ApiQuery({ name: 'skip', description: 'Số lượng bản ghi bỏ qua', required: false, type: Number })
    @ApiQuery({ name: 'take', description: 'Số lượng bản ghi trên mỗi trang', required: false, type: Number })
    @ApiQuery({ name: 'search', description: 'Tìm kiếm theo tên sách, tác giả hoặc ISBN', required: false })
    @ApiQuery({ name: 'category', description: 'Lọc theo thể loại sách', required: false })
    @ApiQuery({ name: 'status', description: 'Lọc theo trạng thái sách', required: false, enum: BookStatus })
    @ApiResponse({
        status: 200,
        description: 'Danh sách sách',
        content: {
            'application/json': {
                example: {
                    data: [
                        {
                            id: 1,
                            title: 'Clean Code',
                            author: 'Robert C. Martin',
                            isbn: '9780132350884',
                            publishYear: 2008,
                            publisher: 'Prentice Hall',
                            category: 'Programming',
                            location: 'A1-01',
                            status: 'available',
                            quantity: 5,
                            description: 'Sách về kỹ thuật viết code sạch',
                            createdAt: '2024-03-12T08:00:00.000Z',
                            updatedAt: '2024-03-12T08:00:00.000Z'
                        }
                    ],
                    total: 1
                }
            }
        }
    })
    async findAll(@Query() query: any): Promise<{ data: BookResponseDto[]; total: number }> {
        const [books, total] = await this.bookService.findAll(query);
        return {
            data: books,
            total
        };
    }

    @Get(':id')
    @Roles(Role.USER, Role.LIBRARIAN, Role.ADMIN)
    @ApiOperation({ summary: 'Lấy thông tin chi tiết một cuốn sách' })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'ID của sách cần tìm',
        schema: { type: 'integer' },
        example: 1
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Thông tin chi tiết sách',
        content: {
            'application/json': {
                example: {
                    id: 1,
                    title: 'Clean Code',
                    author: 'Robert C. Martin',
                    isbn: '9780132350884',
                    publishYear: 2008,
                    publisher: 'Prentice Hall',
                    category: 'Programming',
                    location: 'A1-01',
                    status: 'available',
                    quantity: 5,
                    description: 'Sách về kỹ thuật viết code sạch',
                    createdAt: '2024-03-12T08:00:00.000Z',
                    updatedAt: '2024-03-12T08:00:00.000Z'
                }
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Không tìm thấy sách với ID này',
        content: {
            'application/json': {
                example: {
                    statusCode: 404,
                    message: 'Không tìm thấy sách với ID 1',
                    error: 'Not Found'
                }
            }
        }
    })
    async findOne(@Param('id') id: number): Promise<BookResponseDto> {
        return this.bookService.findOne(id);
    }

    @Put(':id')
    @Roles(Role.LIBRARIAN, Role.ADMIN)
    @ApiOperation({ summary: 'Cập nhật thông tin sách' })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'ID của sách cần cập nhật',
        schema: { type: 'integer' },
        example: 1
    })
    @ApiBody({
        description: 'Thông tin sách cần cập nhật',
        type: UpdateBookDto,
        examples: {
            example1: {
                summary: 'Cập nhật cơ bản',
                value: {
                    title: 'Clean Code - Second Edition',
                    quantity: 10,
                    location: 'A1-02'
                }
            },
            example2: {
                summary: 'Cập nhật trạng thái',
                value: {
                    status: BookStatus.DAMAGED,
                    notes: 'Sách bị hư hỏng nhẹ ở bìa'
                }
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Thông tin sách sau khi cập nhật',
        content: {
            'application/json': {
                example: {
                    id: 1,
                    title: 'Clean Code - Second Edition',
                    author: 'Robert C. Martin',
                    isbn: '9780132350884',
                    publishYear: 2008,
                    publisher: 'Prentice Hall',
                    category: 'Programming',
                    location: 'A1-02',
                    status: 'available',
                    quantity: 10,
                    description: 'Sách về kỹ thuật viết code sạch',
                    createdAt: '2024-03-12T08:00:00.000Z',
                    updatedAt: '2024-03-12T09:00:00.000Z'
                }
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Không tìm thấy sách với ID này',
        content: {
            'application/json': {
                example: {
                    statusCode: 404,
                    message: 'Không tìm thấy sách với ID 1',
                    error: 'Not Found'
                }
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Không có quyền cập nhật sách',
        content: {
            'application/json': {
                example: {
                    statusCode: 403,
                    message: 'Forbidden resource',
                    error: 'Forbidden'
                }
            }
        }
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    async update(
        @Param('id') id: number,
        @Body() updateBookDto: UpdateBookDto,
    ): Promise<BookResponseDto> {
        return this.bookService.update(id, updateBookDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Xóa sách' })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'ID của sách cần xóa',
        schema: { type: 'integer' },
        example: 1
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Xóa sách thành công'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Không tìm thấy sách với ID này',
        content: {
            'application/json': {
                example: {
                    statusCode: 404,
                    message: 'Không tìm thấy sách với ID 1',
                    error: 'Not Found'
                }
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Không có quyền xóa sách',
        content: {
            'application/json': {
                example: {
                    statusCode: 403,
                    message: 'Forbidden resource',
                    error: 'Forbidden'
                }
            }
        }
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    async remove(@Param('id') id: number): Promise<void> {
        await this.bookService.remove(id);
    }
}