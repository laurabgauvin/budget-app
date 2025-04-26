import { Component } from '@angular/core';
import { TransactionsGridComponent } from '../../components/transactions-grid/transactions-grid.component';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrl: './transactions.component.scss',
    imports: [TransactionsGridComponent],
})
export class TransactionsComponent {}
