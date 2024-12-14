import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionInfoDto } from './dto/transaction-info.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transaction)
        private _transactionRepository: Repository<Transaction>
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
                    payee_id: payeeId,
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
                    account_id: accountId,
                },
            },
        });
        if (transactions.length > 0) {
            return transactions.map((c) => this._mapTransactionInfo(c));
        }
        return [];
    }

    // TODO: when insert/update/delete transaction, add trigger to update account balance?

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
            transactionId: transaction.transaction_id,
            accountId: transaction.account.account_id,
            payeeId: transaction.payee.payee_id,
            totalAmount: transaction.total_amount ?? 0,
            notes: transaction.notes ?? '',
        };
    }
}
