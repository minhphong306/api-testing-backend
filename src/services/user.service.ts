import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User, UserStatus } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { UserResponseDto } from '../dtos/response/user.response.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
        const existingUser = await this.userRepository.findOne({
            where: { email: createUserDto.email }
        });

        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        const user = this.userRepository.create(createUserDto);
        const savedUser = await this.userRepository.save(user);
        return new UserResponseDto(savedUser);
    }

    async findAll(query: any): Promise<[UserResponseDto[], number]> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');

        if (query.search) {
            queryBuilder.where('user.name LIKE :search OR user.email LIKE :search OR user.cardNumber LIKE :search',
                { search: `%${query.search}%` });
        }

        if (query.status) {
            queryBuilder.andWhere('user.status = :status', { status: query.status });
        }

        queryBuilder
            .skip(query.skip || 0)
            .take(query.take || 10)
            .orderBy(query.orderBy || 'user.createdAt', query.orderDir || 'DESC');

        const [users, total] = await queryBuilder.getManyAndCount();
        return [users.map(user => new UserResponseDto(user)), total];
    }

    async findOne(id: number): Promise<UserResponseDto> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return new UserResponseDto(user);
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        const user = await this.findOne(id);
        const updatedUser = await this.userRepository.save({
            id: user.id,
            ...updateUserDto,
        } as DeepPartial<User>);
        return new UserResponseDto(updatedUser);
    }

    async remove(id: number): Promise<void> {
        const result = await this.userRepository.softDelete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
    }

    async checkMembershipStatus(id: number): Promise<void> {
        const user = await this.findOne(id);
        if (new Date() > user.membershipExpiry) {
            await this.update(id, { status: UserStatus.EXPIRED });
        }
    }
}