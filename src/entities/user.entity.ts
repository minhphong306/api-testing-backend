import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { BorrowRecord } from './borrow-record.entity';

export enum UserStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  BLOCKED = 'blocked'
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

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

  @Column({ type: 'varchar', length: 50, nullable: true })
  cardNumber?: string;

  @OneToMany(() => BorrowRecord, borrowRecord => borrowRecord.user)
  borrowRecords: BorrowRecord[];
}