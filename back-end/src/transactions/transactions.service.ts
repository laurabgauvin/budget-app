import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { AccountService } from '../account/account.service';
import { CategoryService } from '../category/category.service';
import { PayeeService } from '../payee/payee.service';
import { TagsService } from '../tags/tags.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import {
    TransactionCategoryInfoDto,
    TransactionInfoDto,
    TransactionTagInfoDto,
} from './dto/transaction-info.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
    private readonly logger = new Logger(TransactionsService.name);
    private readonly loadTransactionAllRelations: FindOptionsRelations<Transaction> = {
        account: true,
        payee: true,
        transactionTags: {
            tag: true,
        },
        transactionCategories: {
            category: true,
        },
    };

    constructor(
        @InjectRepository(Transaction)
        private _transactionRepository: Repository<Transaction>,
        private readonly _categoryService: CategoryService,
        private readonly _payeeService: PayeeService,
        private readonly _accountService: AccountService,
        private readonly _tagService: TagsService
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
                relations: this.loadTransactionAllRelations,
            });
            if (transactions.length > 0) {
                return transactions.map((c) => this._mapTransactionInfo(c));
            }
            return [];
        } catch (e) {
            this.logger.error('Exception when getting all transactions:', e);
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
                relations: this.loadTransactionAllRelations,
            });
            if (transactions.length > 0) {
                return transactions.map((c) => this._mapTransactionInfo(c));
            }
            return [];
        } catch (e) {
            this.logger.error('Exception when getting transactions by payee:', e);
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
                relations: this.loadTransactionAllRelations,
            });
            if (transactions.length > 0) {
                return transactions.map((c) => this._mapTransactionInfo(c));
            }
            return [];
        } catch (e) {
            this.logger.error('Exception when getting transactions by account:', e);
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
                relations: this.loadTransactionAllRelations,
            });
            if (transactions.length > 0) {
                return transactions.map((c) => this._mapTransactionInfo(c));
            }
            return [];
        } catch (e) {
            this.logger.error('Exception when getting transactions by category:', e);
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
            this.logger.error('Exception when getting transaction:', e);
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
            const account = await this._accountService.getAccount(transactionDto.accountId);
            if (!account) {
                this.logger.error('Invalid account, cannot create transaction');
                return null;
            }

            const payee = await this._payeeService.getPayee(transactionDto.payeeId);
            if (!payee) {
                this.logger.error('Invalid payee, cannot create transaction');
                return null;
            }

            const valid = this._categoryService.validateTransactionCategories(
                transactionDto.categories,
                transactionDto.amount
            );
            if (!valid) {
                this.logger.error('Invalid categories, cannot create transaction');
                return null;
            }

            // Create transaction
            const transaction = new Transaction();
            transaction.date = transactionDto.date;
            transaction.account = account;
            transaction.payee = payee;
            transaction.totalAmount = transactionDto.amount;
            transaction.notes = transactionDto.notes;
            transaction.status = transactionDto.status;
            await this._transactionRepository.save(transaction);

            // Assign categories
            await this._categoryService.createTransactionCategories(
                transactionDto.categories,
                transaction
            );

            // Assign tags
            await this._tagService.createTransactionTags(transactionDto.tags, transaction);

            return transaction.transactionId;
        } catch (e) {
            this.logger.error('Exception when creating transaction', e);
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
                this.logger.error('Cannot find existing transaction');
                return false;
            }

            const valid = this._categoryService.validateTransactionCategories(
                transactionDto.categories,
                transactionDto.amount
            );
            if (!valid) {
                this.logger.error('Invalid categories, cannot update transaction');
                return false;
            }

            // Update transaction information
            transaction.date = transactionDto.date;
            if (Number(transaction.totalAmount) !== transactionDto.amount)
                transaction.totalAmount = transactionDto.amount;
            transaction.notes = transactionDto.notes;
            transaction.status = transactionDto.status;

            // Update account
            if (transaction.account.accountId !== transactionDto.accountId) {
                const account = await this._accountService.getAccount(transactionDto.accountId);
                if (account) {
                    transaction.account = account;
                }
            }

            // Update payee
            if (transaction.payee.payeeId !== transactionDto.payeeId) {
                const payee = await this._payeeService.getPayee(transactionDto.payeeId);
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

            // Update tags
            await this._tagService.updateTransactionTags(transactionDto.tags, transaction);

            return true;
        } catch (e) {
            this.logger.error('Exception when updating transaction:', e);
            return false;
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
            this.logger.error('Exception when deleting transaction', e);
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
            accountId: transaction.account.accountId,
            accountName: transaction.account.name ?? '',
            payeeId: transaction.payee.payeeId,
            payeeName: transaction.payee.name ?? '',
            totalAmount: transaction.totalAmount ?? 0,
            notes: transaction.notes ?? '',
            status: transaction.status,
            tags:
                transaction.transactionTags?.map(
                    (tt): TransactionTagInfoDto => ({
                        tagId: tt.tag.tagId,
                        tagName: tt.tag.name ?? '',
                    })
                ) ?? [],
            categories:
                transaction.transactionCategories?.map(
                    (tc): TransactionCategoryInfoDto => ({
                        categoryId: tc.category.categoryId,
                        categoryName: tc.category.name ?? '',
                        amount: tc.amount ?? 0,
                        notes: tc.notes ?? '',
                        order: tc.order,
                    })
                ) ?? [],
        };
    }
}
