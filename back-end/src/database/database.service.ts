import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { Account } from '../account/entities/account.entity';
import { TransactionCategory } from '../category/entities/transaction-category.entity';
import { Transaction } from '../transaction/entities/transaction.entity';

@Injectable()
export class DatabaseService {
    private readonly _logger = new Logger(DatabaseService.name);

    constructor(
        @InjectRepository(Account)
        private readonly _accountRepository: Repository<Account>,
        @InjectRepository(Transaction)
        private readonly _transactionRepository: Repository<Transaction>,
        @InjectRepository(TransactionCategory)
        private readonly _transactionCategoryRepository: Repository<TransactionCategory>
    ) {}

    /**
     * Create or update an `Account`
     *
     * @param account
     * @param queryRunner Pass `QueryRunner` if performing operation within a DB transaction
     * @returns accountId
     */
    async saveAccount(account: Account, queryRunner?: QueryRunner): Promise<string | null> {
        try {
            if (queryRunner) {
                return (await queryRunner.manager.save(account)).accountId;
            }
            return (await this._accountRepository.save(account)).accountId;
        } catch (e) {
            this._logger.error('Exception when creating account:', e);
            return null;
        }
    }

    /**
     * Create or update a `Transaction`
     *
     * @param transaction
     * @param queryRunner Pass `QueryRunner` if performing operation within a DB transaction
     * @returns transactionId
     */
    async saveTransaction(
        transaction: Transaction,
        queryRunner?: QueryRunner
    ): Promise<string | null> {
        try {
            if (queryRunner) {
                return (await queryRunner.manager.save(transaction)).transactionId;
            }
            return (await this._transactionRepository.save(transaction)).transactionId;
        } catch (e) {
            this._logger.error('Exception when creating transaction:', e);
            return null;
        }
    }

    /**
     * Create or update a `TransactionCategory`
     *
     * @param transactionCategory
     * @param queryRunner Pass `QueryRunner` if performing operation within a DB transaction
     * @returns transactionCategoryId
     */
    async saveTransactionCategory(
        transactionCategory: TransactionCategory,
        queryRunner?: QueryRunner
    ): Promise<number | null> {
        try {
            if (queryRunner) {
                return (await queryRunner.manager.save(transactionCategory)).transactionCategoryId;
            }
            return (await this._transactionCategoryRepository.save(transactionCategory))
                .transactionCategoryId;
        } catch (e) {
            this._logger.error('Exception when creating transaction category:', e);
            return null;
        }
    }
}
