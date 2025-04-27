import { AccountType } from '../entities/account.entity';

export interface AccountTypeInfoDto {
    type: AccountType;
    displayName: string;
    categoryHeader: string;
}
