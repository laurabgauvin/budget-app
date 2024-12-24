import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountService } from '../account/account.service';
import { Account } from '../account/entities/account.entity';
import { CategoryService } from '../category/category.service';
import { PayeeService } from '../payee/payee.service';
import { TagsService } from '../tags/tags.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import {
    TransactionCategoryInfoDto,
    TransactionInfoDto,
    TransactionTagInfoDto,
} from './dto/transaction-info.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
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
        const transactions = await this._transactionRepository.find({
            order: {
                date: 'desc',
            },
        });
        if (transactions.length > 0) {
            return transactions.map((c) => this._mapTransactionInfo(c));
        }
        return [];
    }

    /**
     * Get all transactions for a payee `TransactionInfoDto`
     *
     * @param payeeId
     */
    async getTransactionInfosByPayee(payeeId: string): Promise<TransactionInfoDto[]> {
        const transactions = await this._transactionRepository.find({
            where: {
                payee: {
                    payeeId: payeeId,
                },
            },
            order: {
                date: 'desc',
            },
        });
        if (transactions.length > 0) {
            return transactions.map((c) => this._mapTransactionInfo(c));
        }
        return [];
    }

    /**
     * Get all transactions for an account `TransactionInfoDto`
     *
     * @param accountId
     */
    async getTransactionInfosByAccount(accountId: string): Promise<TransactionInfoDto[]> {
        const transactions = await this._transactionRepository.find({
            where: {
                account: {
                    accountId: accountId,
                },
            },
            order: {
                date: 'desc',
            },
        });
        if (transactions.length > 0) {
            return transactions.map((c) => this._mapTransactionInfo(c));
        }
        return [];
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
                return null;
            }

            const payee = await this._payeeService.getPayee(transactionDto.payeeId);
            if (!payee) {
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
            await this._categoryService.setTransactionCategories(
                transactionDto.categories,
                transaction
            );

            // Assign tags
            await this._tagService.setTransactionTags(transactionDto.tags, transaction);

            // Update account balance
            await this._updateAccountBalance(account);

            return transaction.transactionId;
        } catch {
            return null;
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
            ...transaction,
            accountId: transaction.account.accountId,
            payeeId: transaction.payee.payeeId,
            totalAmount: transaction.totalAmount ?? 0,
            notes: transaction.notes ?? '',
            tags:
                transaction.transactionTags?.map(
                    (tt): TransactionTagInfoDto => ({
                        transactionTagId: tt.transactionTagId,
                        tagId: tt.tag.tagId,
                        tagName: tt.tag.name ?? '',
                    })
                ) ?? [],
            categories:
                transaction.transactionCategories?.map(
                    (tc): TransactionCategoryInfoDto => ({
                        transactionCategoryId: tc.transactionCategoryId,
                        categoryId: tc.category.categoryId,
                        categoryName: tc.category.name ?? '',
                        amount: tc.amount ?? 0,
                        notes: tc.notes ?? '',
                    })
                ) ?? [],
        };
    }

    /**
     * Recalculate and update the account balance
     *
     * @param account
     */
    private async _updateAccountBalance(account: Account): Promise<void> {
        // Get new balance
        // @ts-expect-error columnName is valid
        const balance = await this._transactionRepository.sum('totalAmount', {
            account: {
                accountId: account.accountId,
            },
        });

        await this._accountService.setAccountBalance(account, balance ?? 0);
    }
}
