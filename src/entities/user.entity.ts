import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { BorrowRecord } from './borrow-record.entity';

export enum UserStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  BLOCKED = 'blocked'
}

export enum UserRole {
  USER = 'user',
  LIBRARIAN = 'librarian',
  ADMIN = 'admin'
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 }) // Thêm cột password
  password: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'date' })
  membershipExpiry: Date;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE
  })
  status: UserStatus;

  @Column({ // Thêm cột role
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole;

  @Column({ type: 'varchar', length: 50, nullable: true })
  cardNumber?: string;

  @OneToMany(() => BorrowRecord, borrowRecord => borrowRecord.user)
  borrowRecords: BorrowRecord[];
}