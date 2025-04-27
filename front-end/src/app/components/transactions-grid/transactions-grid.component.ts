import { CommonModule } from '@angular/common';
import { Component, Signal, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TransactionInfoDto } from '../../services/dto/transaction-info.dto';

interface TransactionRow extends TransactionInfoDto {
    isFutureTransaction: Signal<boolean>;
    isCleared: Signal<boolean>;
}

@Component({
    selector: 'app-transactions-grid',
    templateUrl: './transactions-grid.component.html',
    styleUrl: './transactions-grid.component.scss',
    imports: [CommonModule, MatTableModule, MatChipsModule, MatIconModule, MatButtonModule],
})
export class TransactionsGridComponent {
    displayedColumns: string[] = [
        'date',
        'accountName',
        'payeeName',
        'categoryName',
        'notes',
        'totalAmount',
        'tags',
        'status',
    ];
    dataSource = new MatTableDataSource<TransactionRow>(TEST_DATA);
}
const TEST_DATA: TransactionRow[] = [
    {
        transactionId: '1',
        date: new Date(2023, 5, 15),
        accountId: 'acc1',
        accountName: 'Checking Account',
        payeeId: 'pay1',
        payeeName: 'Grocery Store',
        categoryId: 'cat1',
        categoryName: 'Food',
        totalAmount: -85.75,
        notes: 'Weekly grocery shopping',
        status: 'cleared',
        tags: [{ tagId: 'tag1', tagName: 'Essential' }],
        subCategories: [
            {
                categoryId: 'subcat1',
                categoryName: 'Fruits & Vegetables',
                amount: -35.25,
                notes: '',
                order: 1,
            },
            { categoryId: 'subcat2', categoryName: 'Dairy', amount: -20.5, notes: '', order: 2 },
            { categoryId: 'subcat3', categoryName: 'Meat', amount: -30.0, notes: '', order: 3 },
        ],
        isFutureTransaction: signal(false),
        isCleared: signal(true),
    },
    {
        transactionId: '2',
        date: new Date(2023, 5, 18),
        accountId: 'acc2',
        accountName: 'Credit Card',
        payeeId: 'pay2',
        payeeName: 'Amazon',
        categoryId: 'cat2',
        categoryName: 'Shopping',
        totalAmount: -129.99,
        notes: 'New headphones',
        status: 'cleared',
        tags: [
            { tagId: 'tag2', tagName: 'Electronics' },
            { tagId: 'tag3', tagName: 'Personal' },
        ],
        subCategories: [],
        isFutureTransaction: signal(false),
        isCleared: signal(true),
    },
    {
        transactionId: '3',
        date: new Date(2023, 6, 1),
        accountId: 'acc1',
        accountName: 'Checking Account',
        payeeId: 'pay3',
        payeeName: 'Rent',
        categoryId: 'cat3',
        categoryName: 'Housing',
        totalAmount: -1200.0,
        notes: 'Monthly rent payment',
        status: 'pending',
        tags: [
            { tagId: 'tag1', tagName: 'Essential' },
            { tagId: 'tag4', tagName: 'Monthly' },
        ],
        subCategories: [],
        isFutureTransaction: signal(true),
        isCleared: signal(false),
    },
];
