import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { BorrowRecord } from './borrow-record.entity';

export enum BookStatus {
  AVAILABLE = 'available',
  BORROWED = 'borrowed',
  DAMAGED = 'damaged',
  LOST = 'lost'
}

@Entity('books')
export class Book extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  author: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  isbn: string;

  @Column({ type: 'int' })
  publishYear: number;

  @Column({ type: 'varchar', length: 255 })
  publisher: string;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'varchar', length: 50 })
  location: string;

  @Column({
    type: 'enum',
    enum: BookStatus,
    default: BookStatus.AVAILABLE
  })
  status: BookStatus;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => BorrowRecord, borrowRecord => borrowRecord.book)
  borrowRecords: BorrowRecord[];
}