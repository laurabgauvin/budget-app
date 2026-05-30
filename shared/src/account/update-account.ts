import { OmitType } from '@nestjs/swagger';
import { CreateAccount } from './create-account.js';

export interface UpdateAccount extends Omit<CreateAccount, 'balance'> {
    accountId: string;
}
