import { AccountTypeInfo } from './account-type-info.js';

export interface AccountInfo {
    accountId: string;
    name: string;
    type: AccountTypeInfo;
    balance: number;
    tracked: boolean;
}
