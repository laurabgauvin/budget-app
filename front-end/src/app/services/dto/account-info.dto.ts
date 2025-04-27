export type AccountType =
    | 'cash'
    | 'checking'
    | 'savings'
    | 'credit_card'
    | 'line_of_credit'
    | 'mortgage'
    | 'loan'
    | 'asset'
    | 'liability';

export interface AccountTypeInfoDto {
    type: AccountType;
    displayName: string;
    categoryHeader: string;
}

export interface AccountInfoDto {
    accountId: string;
    name: string;
    type: AccountTypeInfoDto;
    balance: number;
    tracked: boolean;
}
