import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../services/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/dtos/user.dto';
import { UserRole, UserStatus } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
    private readonly salt = Number(process.env.MYSQL_PWD_SALT || 10); 
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {
        console.log('this.salt', this.salt);
     }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        console.log('db pwd', user.password);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
        };
        return this.jwtService.sign(payload);
    }

    async register(createUserDto: CreateUserDto) {
        const existingUser = await this.userService.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new BadRequestException('Email đã được sử dụng');
        }
       
        const hashedPassword = await this.hashPassword(createUserDto.password);
        const user = this.userService.create({
            ...createUserDto,
            status: UserStatus.ACTIVE,
            password: hashedPassword,
            role: createUserDto.role || UserRole.USER
        });
        return user;
    }

    async refresh(refreshToken: string) {
        const payload = this.jwtService.verify(refreshToken);
        if (!payload) {
            throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
        }
        return this.login(payload);
    }

    async hashPassword(password: string) {
        const result = await bcrypt.hash(password, this.salt);
        console.log(`hasing ${password} to ${result}`);
        return result;
    }
    
}
