import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountService } from '../account/account.service';
import { CategoryService } from '../category/category.service';
import { TransactionCategory } from '../category/entities/transaction-category.entity';
import { PayeeService } from '../payee/payee.service';
import { TransactionTag } from '../tags/entities/transaction-tag.entity';
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
        @InjectRepository(TransactionCategory)
        private _transactionCategoryRepository: Repository<TransactionCategory>,
        @InjectRepository(TransactionTag)
        private _transactionTagRepository: Repository<TransactionTag>,
        private readonly _categoryService: CategoryService,
        private readonly _payeeService: PayeeService,
        private readonly _accountService: AccountService,
        private readonly _tagService: TagsService
    ) {}

    /**
     * Get all transactions `TransactionInfoDto`
     */
    async getAllTransactionInfos(): Promise<TransactionInfoDto[]> {
        const transactions = await this._transactionRepository.find();
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
        });
        if (transactions.length > 0) {
            return transactions.map((c) => this._mapTransactionInfo(c));
        }
        return [];
    }

    // TODO: when insert/update/delete transaction, add trigger to update account balance?

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
            // TODO: call category service for this
            const transactionCategories: TransactionCategory[] = [];
            for (const c of transactionDto.categories) {
                const category = await this._categoryService.getCategory(c.categoryId);
                if (category) {
                    const tranCat = new TransactionCategory();
                    tranCat.transaction = transaction;
                    tranCat.category = category;
                    tranCat.notes = c.notes;
                    tranCat.amount = c.amount;
                    transactionCategories.push(tranCat);
                }
            }
            await this._transactionCategoryRepository.save(transactionCategories);

            // Assign tags
            // TODO: call tag service for this
            const transactionTags: TransactionTag[] = [];
            if (transactionDto.tags) {
                for (const t of transactionDto.tags) {
                    const tag = await this._tagService.getTag(t);
                    if (tag) {
                        const tranTag = new TransactionTag();
                        tranTag.transaction = transaction;
                        tranTag.tag = tag;
                        transactionTags.push(tranTag);
                    }
                }
            }
            await this._transactionTagRepository.save(transactionTags);

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
}
