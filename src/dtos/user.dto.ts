import { IsString, IsEmail, IsEnum, IsDate, IsOptional, MaxLength } from 'class-validator';
import { UserStatus } from '../entities/user.entity';
import { Transform, Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

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
  status: UserStatus;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  cardNumber?: string;
}

export class UpdateUserDto implements Partial<CreateUserDto> {}