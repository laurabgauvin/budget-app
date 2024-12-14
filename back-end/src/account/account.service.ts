import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountInfoDto } from './dto/account-info.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private _accountRepository: Repository<Account>
    ) {}

    /**
     * Get all accounts `AccountInfoDto`
     */
    async getAllAccountInfos(): Promise<AccountInfoDto[]> {
        const accounts = await this._accountRepository.find();
        if (accounts.length > 0) {
            return accounts.map((c) => this._mapAccountInfo(c));
        }
        return [];
    }

    /**
     * Get a single account `AccountInfoDto`
     *
     * @param id
     */
    async getAccountInfo(id: string): Promise<AccountInfoDto | null> {
        const account = await this.getAccount(id);
        if (account) {
            return this._mapAccountInfo(account);
        }
        return null;
    }

    /**
     * Get a single account `Account`
     *
     * @param id
     */
    async getAccount(id: string): Promise<Account | null> {
        return await this._accountRepository.findOneBy({ accountId: id });
    }

    /**
     * Create a new account
     *
     * @param createAccountDto
     */
    async createAccount(createAccountDto: CreateAccountDto): Promise<string | null> {
        try {
            const account = new Account();
            account.name = createAccountDto.name;
            account.balance = 0;

            const db = await this._accountRepository.save(account);
            return db.accountId;
        } catch {
            return null;
        }
    }

    /**
     * Update an existing account
     *
     * @param updateAccountDto
     */
    async updateAccount(updateAccountDto: UpdateAccountDto): Promise<boolean> {
        try {
            const account = await this.getAccount(updateAccountDto.accountId);
            if (account) {
                account.name = updateAccountDto.name;

                await this._accountRepository.save(account);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Map a `Account` to a `AccountInfoDto`
     *
     * @param account
     */
    private _mapAccountInfo(account: Account): AccountInfoDto {
        return {
            ...account,
            balance: account.balance ?? 0,
        };
    }
}
