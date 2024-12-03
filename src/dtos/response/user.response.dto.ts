import { User } from '../../entities/user.entity';
import { BaseResponseDto } from './base.response.dto';

export class UserResponseDto extends BaseResponseDto {
    name: string;
    email: string;
    phone: string;
    address?: string;
    membershipExpiry: Date;
    status: string;
    cardNumber?: string;

    constructor(user: User) {
        super();
        Object.assign(this, user);
    }
}