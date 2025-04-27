import { AccountType } from '../dto/account-info.dto';

export interface AccountTypeInfo {
    type: AccountType;
    displayName: string;
    categoryHeader: string;
}

export interface Account {
    id: string;
    name: string;
    type: AccountTypeInfo;
    balance: number;
    tracked: boolean;
}
