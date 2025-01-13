import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayeeService } from '../payee/payee.service';
import { CreateTransactionDto } from '../transaction/dto/create-transaction.dto';
import { TransactionStatus } from '../transaction/entities/transaction.entity';
import { TransactionService } from '../transaction/transaction.service';
import { AccountInfoDto } from './dto/account-info.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountService {
    private readonly _logger = new Logger(AccountService.name);

    constructor(
        @InjectRepository(Account)
        private readonly _accountRepository: Repository<Account>,
        @Inject(forwardRef(() => TransactionService))
        private readonly _transactionService: TransactionService,
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
     * Create a new account
     *
     * @param createAccountDto
     */
    async createAccount(createAccountDto: CreateAccountDto): Promise<string | null> {
        try {
            // Check if an account with that name already exists
            const existingAccount = await this.getAccountInfoByName(createAccountDto.name);
            if (existingAccount) {
                this._logger.error(
                    `An account with this name: '${createAccountDto.name}' already exists`
                );
                return null;
            }

            // Create account
            const account = new Account();
            account.name = createAccountDto.name;
            account.type = createAccountDto.type;
            account.tracked = createAccountDto.tracked;
            const db = await this._accountRepository.save(account);

            // TODO: throws exception
            // Create starter transaction
            if (createAccountDto.balance && createAccountDto.balance > 0) {
                // Get default payee
                const defaultPayee = await this._payeeService.getStartingBalancePayee();
                if (defaultPayee) {
                    const starterTran = new CreateTransactionDto();
                    starterTran.date = new Date();
                    starterTran.accountId = db.accountId;
                    starterTran.payeeId = defaultPayee.payeeId;
                    starterTran.amount = createAccountDto.balance;
                    starterTran.notes = '';
                    starterTran.status = TransactionStatus.Pending;
                    if (account.tracked) {
                        starterTran.categories = [
                            {
                                categoryId: defaultPayee.defaultCategory?.categoryId ?? '',
                                amount: createAccountDto.balance,
                                notes: '',
                                order: 0,
                            },
                        ];
                    }
                    starterTran.tags = [];

                    await this._transactionService.createTransaction(starterTran);
                }
            }

            return db.accountId;
        } catch (e) {
            this._logger.error('Exception when creating account:', e);
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

                await this._accountRepository.save(account);
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
            await this._accountRepository.save(account);
            await this._accountRepository.softRemove(account);
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
            type: account.type,
            balance: account.balance ?? 0,
            tracked: account.tracked,
        };
    }
}
