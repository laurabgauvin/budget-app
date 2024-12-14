import { TransactionStatus } from '../entities/transaction.entity';

export interface TransactionInfoDto {
    transactionId: string;
    date: Date;
    accountId: string;
    payeeId: string;
    totalAmount: number;
    notes: string;
    status: TransactionStatus;
}
