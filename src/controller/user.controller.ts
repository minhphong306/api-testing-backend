import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { UserResponseDto } from '../dtos/response/user.response.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    @ApiOperation({ summary: 'Create new user' })
    @ApiResponse({ status: HttpStatus.CREATED, type: UserResponseDto })
    async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        return this.userService.create(createUserDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all users with pagination and filters' })
    @ApiResponse({ status: HttpStatus.OK, type: [UserResponseDto] })
    async findAll(@Query() query: any): Promise<{ data: UserResponseDto[]; total: number }> {
        const [users, total] = await this.userService.findAll(query);
        return {
            data: users,
            total
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by id' })
    @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
    async findOne(@Param('id') id: number): Promise<UserResponseDto> {
        return this.userService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
    async update(
        @Param('id') id: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserResponseDto> {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete user' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async remove(@Param('id') id: number): Promise<void> {
        await this.userService.remove(id);
    }
}