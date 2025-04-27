import { AccountTypeInfoDto } from './account-type-info.dto';

export interface AccountInfoDto {
    accountId: string;
    name: string;
    type: AccountTypeInfoDto;
    balance: number;
    tracked: boolean;
}
