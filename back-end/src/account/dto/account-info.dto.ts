import { AccountType } from '../entities/account.entity';

export interface AccountInfoDto {
    accountId: string;
    name: string;
    type: AccountType;
    balance: number;
    tracked: boolean;
}
