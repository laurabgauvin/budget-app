import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountInfoDto } from './dto/account-info.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountService {
    private readonly logger = new Logger(AccountService.name);

    constructor(
        @InjectRepository(Account)
        private _accountRepository: Repository<Account>
    ) {}

    /**
     * Get all accounts `AccountInfoDto`
     */
    async getAllAccountInfos(): Promise<AccountInfoDto[]> {
        try {
            const accounts = await this._accountRepository.find();
            if (accounts.length > 0) {
                return accounts.map((c) => this._mapAccountInfo(c));
            }
            return [];
        } catch (e) {
            this.logger.error('Exception when getting all accounts:', e);
            return [];
        }
    }

    /**
     * Get a single account `AccountInfoDto`
     *
     * @param id
     */
    async getAccountInfo(id: string): Promise<AccountInfoDto | null> {
        try {
            const account = await this.getAccount(id);
            if (account) {
                return this._mapAccountInfo(account);
            }
            return null;
        } catch (e) {
            this.logger.error('Exception when getting account:', e);
            return null;
        }
    }

    /**
     * Get a single account `Account`
     *
     * @param id
     */
    async getAccount(id: string): Promise<Account | null> {
        try {
            return await this._accountRepository.findOneBy({ accountId: id });
        } catch (e) {
            this.logger.error('Exception when getting account:', e);
            return null;
        }
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
            account.type = createAccountDto.type;
            account.tracked = createAccountDto.tracked;

            const db = await this._accountRepository.save(account);
            return db.accountId;
        } catch (e) {
            this.logger.error('Exception when creating account:', e);
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
                account.type = updateAccountDto.type;
                account.tracked = updateAccountDto.tracked;

                await this._accountRepository.save(account);
                return true;
            }
            return false;
        } catch (e) {
            this.logger.error('Exception when updating account:', e);
            return false;
        }
    }

    async deleteAccount(accountId: string): Promise<boolean> {
        try {
            const account = await this.getAccount(accountId);
            if (account) {
                account.tracked = false;
                await this._accountRepository.save(account);
                await this._accountRepository.softRemove(account);
                return true;
            }
            return true;
        } catch (e) {
            this.logger.error('Exception when deleting account:', e);
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
            name: account.name ?? '',
            balance: account.balance ?? 0,
        };
    }
}
