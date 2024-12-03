import { IsString, IsInt, IsEnum, IsOptional, IsISBN, Min, MaxLength } from 'class-validator';
import { BookStatus } from '../entities/book.entity';

export class CreateBookDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  @MaxLength(255)
  author: string;

  @IsISBN()
  isbn: string;

  @IsInt()
  @Min(1000)
  publishYear: number;

  @IsString()
  @MaxLength(255)
  publisher: string;

  @IsString()
  @MaxLength(100)
  category: string;

  @IsString()
  @MaxLength(50)
  location: string;

  @IsEnum(BookStatus)
  status: BookStatus;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateBookDto implements Partial<CreateBookDto> {}