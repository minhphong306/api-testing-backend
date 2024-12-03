import { Book } from '../../entities/book.entity';
import { BaseResponseDto } from './base.response.dto';

export class BookResponseDto extends BaseResponseDto {
    title: string;
    author: string;
    isbn: string;
    publishYear: number;
    publisher: string;
    category: string;
    location: string;
    status: string;
    quantity: number;
    description?: string;

    constructor(book: Book) {
        super();
        Object.assign(this, book);
    }
}