import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsRelations, Repository } from 'typeorm';
import { AccountService } from '../account/account.service';
import { CategoryService } from '../category/category.service';
import { PayeeService } from '../payee/payee.service';
import { TagService } from '../tag/tag.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { MoveToPayeeDto } from './dto/move-to-payee.dto';
import {
    TransactionCategoryInfoDto,
    TransactionInfoDto,
    TransactionTagInfoDto,
} from './dto/transaction-info.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
    private readonly _logger = new Logger(TransactionService.name);
    private readonly _loadTransactionAllRelations: FindOptionsRelations<Transaction> = {
        account: true,
        payee: true,
        tags: true,
        transactionCategories: {
            category: true,
        },
    };

    constructor(
        @InjectRepository(Transaction)
        private readonly _transactionRepository: Repository<Transaction>,
        private readonly _categoryService: CategoryService,
        private readonly _payeeService: PayeeService,
        @Inject(forwardRef(() => AccountService))
        private readonly _accountService: AccountService,
        private readonly _tagService: TagService,
        private readonly _dataSource: DataSource
    ) {}

    /**
     * Get all transactions `TransactionInfoDto`
     */
    async getAllTransactionInfos(): Promise<TransactionInfoDto[]> {
        try {
            const transactions = await this._transactionRepository.find({
                order: {
                    date: 'desc',
                },
                relations: this._loadTransactionAllRelations,
            });
            if (transactions.length > 0) {
                return transactions.map((c) => this._mapTransactionInfo(c));
            }
            return [];
        } catch (e) {
            this._logger.error('Exception when getting all transactions:', e);
            return [];
        }
    }

    /**
     * Get all transactions for a payee `TransactionInfoDto`
     *
     * @param payeeId
     */
    async getTransactionInfosByPayee(payeeId: string): Promise<TransactionInfoDto[]> {
        try {
            const transactions = await this._transactionRepository.find({
                where: {
                    payee: {
                        payeeId: payeeId,
                    },
                },
                order: {
                    date: 'desc',
                },
                relations: this._loadTransactionAllRelations,
            });
            if (transactions.length > 0) {
                return transactions.map((c) => this._mapTransactionInfo(c));
            }
            return [];
        } catch (e) {
            this._logger.error('Exception when getting transactions by payee:', e);
            return [];
        }
    }

    /**
     * Get all transactions for an account `TransactionInfoDto`
     *
     * @param accountId
     */
    async getTransactionInfosByAccount(accountId: string): Promise<TransactionInfoDto[]> {
        try {
            const transactions = await this._transactionRepository.find({
                where: {
                    account: {
                        accountId: accountId,
                    },
                },
                order: {
                    date: 'desc',
                },
                relations: this._loadTransactionAllRelations,
            });
            if (transactions.length > 0) {
                return transactions.map((c) => this._mapTransactionInfo(c));
            }
            return [];
        } catch (e) {
            this._logger.error('Exception when getting transactions by account:', e);
            return [];
        }
    }

    /**
     * Get all transactions for a category `TransactionInfoDto`
     *
     * @param categoryId
     */
    async getTransactionInfosByCategory(categoryId: string): Promise<TransactionInfoDto[]> {
        try {
            const transactions = await this._transactionRepository.find({
                where: {
                    transactionCategories: {
                        category: {
                            categoryId: categoryId,
                        },
                    },
                },
                order: {
                    date: 'desc',
                },
                relations: this._loadTransactionAllRelations,
            });
            if (transactions.length > 0) {
                return transactions.map((c) => this._mapTransactionInfo(c));
            }
            return [];
        } catch (e) {
            this._logger.error('Exception when getting transactions by category:', e);
            return [];
        }
    }

    /**
     * Get a single transaction `Transaction`. Loads `Account` and `Payee` relations
     *
     * @param id
     */
    async getTransaction(id: string): Promise<Transaction | null> {
        try {
            return await this._transactionRepository.findOne({
                where: {
                    transactionId: id,
                },
                relations: ['account', 'payee'],
            });
        } catch (e) {
            this._logger.error('Exception when getting transaction:', e);
            return null;
        }
    }

    /**
     * Create a new transaction
     *
     * @param transactionDto
     */
    async createTransaction(transactionDto: CreateTransactionDto): Promise<string | null> {
        try {
            const account = await this._accountService.getAccountById(transactionDto.accountId);
            if (!account) {
                this._logger.error('Invalid account, cannot create transaction');
                return null;
            }

            const payee = await this._payeeService.getPayeeById(transactionDto.payeeId);
            if (!payee) {
                this._logger.error('Invalid payee, cannot create transaction');
                return null;
            }

            // TODO: don't need to do validation if account is not tracked, no categories
            if (account.tracked) {
                const valid = this._categoryService.validateTransactionCategories(
                    transactionDto.categories,
                    transactionDto.amount
                );
                if (!valid) {
                    this._logger.error('Invalid categories, cannot create transaction');
                    return null;
                }
            }

            // Start DB transaction
            const queryRunner = this._dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            // TODO: working on transaction, tran-cat throws exception
            try {
                // Create transaction
                const transaction = new Transaction();
                transaction.date = transactionDto.date;
                transaction.account = account;
                transaction.payee = payee;
                transaction.totalAmount = transactionDto.amount;
                transaction.notes = transactionDto.notes;
                transaction.status = transactionDto.status;
                transaction.tags = await this._tagService.getTagsById(transactionDto.tags);
                await queryRunner.manager.save(transaction);

                // Assign categories
                if (account.tracked) {
                    const result =
                        await this._categoryService.createTransactionCategoriesInDbTransaction(
                            transactionDto.categories,
                            transaction,
                            queryRunner
                        );
                    if (result.length < transactionDto.categories.length)
                        throw new Error('Error when creating transaction categories');
                }

                return transaction.transactionId;
            } catch (e) {
                this._logger.error('Exception when creating transaction, rolling back.', e);
                await queryRunner.rollbackTransaction();
                return null;
            }
        } catch (e) {
            this._logger.error('Exception when creating transaction:', e);
            return null;
        }
    }

    /**
     * Update the data of an existing transaction
     *
     * @param transactionDto
     */
    async updateTransaction(transactionDto: UpdateTransactionDto): Promise<boolean> {
        try {
            // Get transaction
            const transaction = await this.getTransaction(transactionDto.transactionId);
            if (!transaction) {
                this._logger.error('Cannot find existing transaction');
                return false;
            }

            // TODO: don't need to do validation if account is not tracked, no categories
            const valid = this._categoryService.validateTransactionCategories(
                transactionDto.categories,
                transactionDto.amount
            );
            if (!valid) {
                this._logger.error('Invalid categories, cannot update transaction');
                return false;
            }

            // Update transaction information
            transaction.date = transactionDto.date;
            if (Number(transaction.totalAmount) !== transactionDto.amount)
                transaction.totalAmount = transactionDto.amount;
            transaction.notes = transactionDto.notes;
            transaction.status = transactionDto.status;
            transaction.tags = await this._tagService.getTagsById(transactionDto.tags);

            // Update account
            if (
                transaction.account === undefined ||
                transaction.account.accountId !== transactionDto.accountId
            ) {
                const account = await this._accountService.getAccountById(transactionDto.accountId);
                if (account) {
                    transaction.account = account;
                }
            }

            // Update payee
            if (transaction.payee.payeeId !== transactionDto.payeeId) {
                const payee = await this._payeeService.getPayeeById(transactionDto.payeeId);
                if (payee) {
                    transaction.payee = payee;
                }
            }

            // Save changes
            await this._transactionRepository.save(transaction);

            // Update categories
            await this._categoryService.updateTransactionCategories(
                transactionDto.categories,
                transaction
            );

            return true;
        } catch (e) {
            this._logger.error('Exception when updating transaction:', e);
            return false;
        }
    }

    /**
     * Move all transactions from one payee to another
     *
     * @param dto
     */
    async moveToPayee(dto: MoveToPayeeDto): Promise<number> {
        try {
            const oldPayee = await this._payeeService.getPayeeById(dto.oldPayeeId);
            if (!oldPayee) return -1;

            const newPayee = await this._payeeService.getPayeeById(dto.newPayeeId);
            if (!newPayee) return -1;

            if (oldPayee.transactions) {
                const transactions = oldPayee.transactions;
                transactions.forEach((t) => {
                    t.payee = newPayee;
                });
                const result = await this._transactionRepository.save(transactions);
                return result.length;
            }
            return 0;
        } catch (e) {
            this._logger.error('Exception when moving to new payee:', e);
            return -1;
        }
    }

    /**
     * Delete an existing transaction
     *
     * @param id
     */
    async deleteTransaction(id: string): Promise<boolean> {
        try {
            const transaction = await this._transactionRepository.findOneBy({
                transactionId: id,
            });
            if (!transaction) return true;

            await this._transactionRepository.remove(transaction);
            return true;
        } catch (e) {
            this._logger.error('Exception when deleting transaction:', e);
            return false;
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Map a `Transaction` to a `TransactionInfoDto`
     *
     * @param transaction
     */
    private _mapTransactionInfo(transaction: Transaction): TransactionInfoDto {
        return {
            transactionId: transaction.transactionId,
            date: transaction.date,
            accountId: transaction.account?.accountId ?? '',
            accountName: transaction.account?.name ?? '',
            payeeId: transaction.payee.payeeId,
            payeeName: transaction.payee.name ?? '',
            categoryId:
                transaction.transactionCategories?.length === 1
                    ? transaction.transactionCategories[0].category.categoryId
                    : '',
            categoryName:
                (transaction.transactionCategories?.length === 1
                    ? transaction.transactionCategories[0].category.name
                    : 'Split') ?? '',
            totalAmount: transaction.totalAmount ?? 0,
            notes: transaction.notes ?? '',
            status: transaction.status,
            tags:
                transaction.tags?.map(
                    (tag): TransactionTagInfoDto => ({
                        tagId: tag.tagId,
                        tagName: tag.name ?? '',
                    })
                ) ?? [],
            subCategories:
                transaction.transactionCategories && transaction.transactionCategories.length > 1
                    ? transaction.transactionCategories
                          .map(
                              (tc): TransactionCategoryInfoDto => ({
                                  categoryId: tc.category.categoryId,
                                  categoryName: tc.category.name ?? '',
                                  amount: tc.amount ?? 0,
                                  notes: tc.notes ?? '',
                                  order: tc.order,
                              })
                          )
                          .sort((a, b) => a.order - b.order)
                    : [],
        };
    }
}
