import { TransactionStatus } from '../entities/transaction.entity';

export interface TransactionInfoDto {
    transactionId: string;
    date: Date | undefined;
    accountId: string;
    payeeId: string;
    totalAmount: number;
    notes: string;
    status: TransactionStatus;
    tags: TransactionTagInfoDto[];
    categories: TransactionCategoryInfoDto[];
}

export interface TransactionTagInfoDto {
    transactionTagId: number;
    tagId: string;
    tagName: string;
}

export interface TransactionCategoryInfoDto {
    transactionCategoryId: number;
    categoryId: string;
    categoryName: string;
    amount: number;
    notes: string;
}
