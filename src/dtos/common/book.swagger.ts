// import { ApiProperty } from "@nestjs/swagger";
// import { string } from "joi";
// import { BookStatus } from "src/entities/book.entity";
// import { PaginationQueryDto } from "./pagination.dto";

// export type BookQueryAllDto = PaginationQueryDto & {
//     @ApiProperty({ required: false, enum: BookStatus });
//     status?: BookStatus;
//     @ApiProperty({ required: false });
//     category?: string;
//   }