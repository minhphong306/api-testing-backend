import { IsString, IsEmail, IsEnum, IsDate, IsOptional, MaxLength, MinLength } from 'class-validator';
import { UserStatus, UserRole } from '../entities/user.entity';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password: string;

  @IsString()
  @MaxLength(20)
  phone: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsDate()
  @Type(() => Date)
  membershipExpiry: Date;

  @IsEnum(UserStatus)
  @IsOptional()
  status: UserStatus;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  cardNumber?: string;
}

export class UpdateUserDto implements Partial<CreateUserDto> {

}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}