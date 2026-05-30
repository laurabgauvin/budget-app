import { AccountType } from '../shared/enum.js';

export interface CreateAccount {
    name: string;
    type: AccountType;
    tracked: boolean;
    balance: number | undefined;
}
