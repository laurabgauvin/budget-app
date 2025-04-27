import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TransactionCategory } from '../category/entities/transaction-category.entity';
import { DatabaseService } from '../database/database.service';
import { PayeeService } from '../payee/payee.service';
import { Transaction } from '../transaction/entities/transaction.entity';
import { AccountInfoDto } from './dto/account-info.dto';
import { AccountTypeInfoDto } from './dto/account-type-info.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account, AccountType } from './entities/account.entity';

@Injectable()
export class AccountService {
    private readonly _logger = new Logger(AccountService.name);

    constructor(
        @InjectRepository(Account)
        private readonly _accountRepository: Repository<Account>,
        private readonly _databaseService: DatabaseService,
        private readonly _dataSource: DataSource,
        private readonly _payeeService: PayeeService
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

            this._logger.log('No account found');
            return [];
        } catch (e) {
            this._logger.error('Exception when getting all accounts:', e);
            return [];
        }
    }

    /**
     * Get a single account `AccountInfoDto`
     *
     * @param id
     */
    async getAccountInfoById(id: string): Promise<AccountInfoDto | null> {
        try {
            const account = await this.getAccountById(id);
            if (account) return this._mapAccountInfo(account);

            this._logger.warn(`Could not find account: '${id}'`);
            return null;
        } catch (e) {
            this._logger.error('Exception when getting account:', e);
            return null;
        }
    }

    /**
     * Get a single payee `AccountInfoDto` by name. Checks deleted records
     *
     * @param name
     */
    async getAccountInfoByName(name: string): Promise<AccountInfoDto | null> {
        try {
            const account = await this._accountRepository.findOne({
                where: {
                    name: name,
                },
                withDeleted: true,
            });
            if (account) return this._mapAccountInfo(account);

            this._logger.log(`No account found with name: '${name}'`);
            return null;
        } catch (e) {
            this._logger.error('Exception when getting the account by name:', e);
            return null;
        }
    }

    /**
     * Get a single account `Account`
     *
     * @param id
     */
    async getAccountById(id: string): Promise<Account | null> {
        try {
            return await this._accountRepository.findOneBy({ accountId: id });
        } catch (e) {
            this._logger.error('Exception when getting account:', e);
            return null;
        }
    }

    /**
     * Get the account balance
     *
     * @param id
     */
    async getAccountBalance(id: string): Promise<number> {
        try {
            return (await this.getAccountById(id))?.balance ?? 0;
        } catch (e) {
            this._logger.error('Exception when getting account balance:', e);
            return -1;
        }
    }

    /**
     * Get all valid account types with display names
     */
    getValidAccountTypes(): Promise<AccountTypeInfoDto[]> {
        try {
            const accountTypes = Object.values(AccountType)
                .map((t) => this._mapAccountTypeInfo(t))
                .sort((a, b) => a.displayName.localeCompare(b.displayName))
                .sort((a, b) => a.categoryHeader.localeCompare(b.categoryHeader));
            return Promise.resolve(accountTypes);
        } catch (e) {
            this._logger.error('Exception when getting all account types:', e);
            return Promise.resolve([]);
        }
    }

    /**
     * Create a new account
     *
     * @param createAccountDto
     */
    async createAccount(createAccountDto: CreateAccountDto): Promise<string | null> {
        // Check if an account with that name already exists
        const existingAccount = await this.getAccountInfoByName(createAccountDto.name);
        if (existingAccount) {
            this._logger.error(
                `An account with this name: '${createAccountDto.name}' already exists`
            );
            return null;
        }

        // Start DB transaction
        const queryRunner = this._dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Create account
            const account = new Account();
            account.name = createAccountDto.name;
            account.type = createAccountDto.type;
            account.tracked = createAccountDto.tracked;
            await this._databaseService.save(account, queryRunner);
            if (!account.accountId) {
                this._logger.error('Could not create Account record');
                await queryRunner.rollbackTransaction();
                return null;
            }

            if (createAccountDto.balance && createAccountDto.balance > 0) {
                // Create starter transaction
                const defaultPayee = await this._payeeService.getStartingBalancePayee();
                if (defaultPayee) {
                    const starterTran = new Transaction();
                    starterTran.date = new Date();
                    starterTran.account = account;
                    starterTran.payee = defaultPayee;
                    starterTran.totalAmount = createAccountDto.balance;
                    await this._databaseService.save(starterTran, queryRunner);

                    if (account.tracked && defaultPayee.defaultCategory) {
                        const tranCat = new TransactionCategory();
                        tranCat.transaction = starterTran;
                        tranCat.category = defaultPayee.defaultCategory;
                        tranCat.amount = createAccountDto.balance;
                        tranCat.order = 0;
                        await this._databaseService.save(tranCat, queryRunner);
                    }
                }
            }

            await queryRunner.commitTransaction();
            return account.accountId;
        } catch (e) {
            this._logger.error('Exception when creating account, rolling back.', e);
            await queryRunner.rollbackTransaction();
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
            // Check if an account with that name already exists
            const existingAccount = await this.getAccountInfoByName(updateAccountDto.name);
            if (existingAccount && existingAccount.accountId !== updateAccountDto.accountId) {
                this._logger.error(
                    `An account with this name: '${updateAccountDto.name}' already exists`
                );
                return false;
            }

            const account = await this.getAccountById(updateAccountDto.accountId);
            if (account) {
                account.name = updateAccountDto.name;
                account.type = updateAccountDto.type;
                account.tracked = updateAccountDto.tracked;

                await this._databaseService.save(account);
                return true;
            }

            this._logger.warn(`Could not find account: '${updateAccountDto.accountId}' to update`);
            return false;
        } catch (e) {
            this._logger.error('Exception when updating account:', e);
            return false;
        }
    }

    /**
     * Delete an existing account
     *
     * @param id
     */
    async deleteAccount(id: string): Promise<boolean> {
        try {
            const account = await this.getAccountById(id);
            if (!account) return true;

            // Check balance
            if (account.balance && account.balance > 0) {
                this._logger.error(
                    `Account: '${id}' cannot be deleted, it has an outstanding balance`
                );
                return false;
            }

            account.tracked = false;
            await this._databaseService.save(account);
            await this._databaseService.softRemove(account);
            return true;
        } catch (e) {
            this._logger.error('Exception when deleting account:', e);
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
            accountId: account.accountId,
            name: account.name ?? '',
            type: this._mapAccountTypeInfo(account.type),
            balance: account.balance ?? 0,
            tracked: account.tracked,
        };
    }

    /**
     * Map a `AccountType` to a `AccountTypeInfoDto`
     *
     * @param type
     */
    private _mapAccountTypeInfo(type: AccountType): AccountTypeInfoDto {
        return {
            type: type,
            displayName: this._getAccountTypeDisplayName(type),
            categoryHeader: this._getAccountTypeCategoryHeader(type),
        };
    }

    /**
     * Get the display name for a given account type
     *
     * @param type
     */
    private _getAccountTypeDisplayName(type: AccountType): string {
        switch (type) {
            case AccountType.Cash:
                return 'Cash';
            case AccountType.Checking:
                return 'Checking';
            case AccountType.Savings:
                return 'Savings';
            case AccountType.CreditCard:
                return 'Credit Card';
            case AccountType.LineOfCredit:
                return 'Line of Credit';
            case AccountType.Mortgage:
                return 'Mortgage';
            case AccountType.Loan:
                return 'Loan';
            case AccountType.Asset:
                return 'Asset';
            case AccountType.Liability:
                return 'Liability';
            case AccountType.Investment:
                return 'Investment';
            default:
                return type;
        }
    }

    /**
     * Get the category header for a given account type
     *
     * @param type
     */
    private _getAccountTypeCategoryHeader(type: AccountType): string {
        switch (type) {
            case AccountType.Cash:
            case AccountType.Checking:
            case AccountType.Savings:
                return 'Cash';
            case AccountType.CreditCard:
            case AccountType.LineOfCredit:
                return 'Credit';
            case AccountType.Mortgage:
            case AccountType.Loan:
                return 'Loan';
            case AccountType.Asset:
            case AccountType.Investment:
            case AccountType.Liability:
            default:
                return 'Other Asset or Liability';
        }
    }
}
