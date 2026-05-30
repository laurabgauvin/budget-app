import { AccountType } from '../shared/enum.js';

export interface AccountTypeInfo {
    type: AccountType;
    displayName: string;
    categoryHeader: string;
}
