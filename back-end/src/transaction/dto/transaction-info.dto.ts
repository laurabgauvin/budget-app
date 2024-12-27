import { TransactionStatus } from '../entities/transaction.entity';

export interface TransactionInfoDto {
    transactionId: string;
    date: Date | undefined;
    accountId: string;
    accountName: string;
    payeeId: string;
    payeeName: string;
    totalAmount: number;
    notes: string;
    status: TransactionStatus;
    tags: TransactionTagInfoDto[];
    categories: TransactionCategoryInfoDto[];
}

export interface TransactionTagInfoDto {
    tagId: string;
    tagName: string;
}

export interface TransactionCategoryInfoDto {
    categoryId: string;
    categoryName: string;
    amount: number;
    notes: string;
    order: number;
}
