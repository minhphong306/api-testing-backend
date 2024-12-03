import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Book } from './book.entity';
import { User } from './user.entity';

export enum BorrowStatus {
  BORROWED = 'borrowed',
  RETURNED = 'returned',
  OVERDUE = 'overdue'
}

@Entity('borrow_records')
export class BorrowRecord extends BaseEntity {
  @ManyToOne(() => Book, book => book.borrowRecords)
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @ManyToOne(() => User, user => user.borrowRecords)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'timestamp' })
  borrowDate: Date;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  returnDate?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fineAmount: number;

  @Column({
    type: 'enum',
    enum: BorrowStatus,
    default: BorrowStatus.BORROWED
  })
  status: BorrowStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;
}