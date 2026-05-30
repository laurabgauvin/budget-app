import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

interface BudgetRow {
    categoryId: number;
    categoryName: string;
    budgeted: number;
    spent: number;
    available: number;
}

@Component({
    selector: 'app-budget',
    templateUrl: './budget.component.html',
    styleUrl: './budget.component.css',
    imports: [MatTableModule, CommonModule],
})
export class BudgetComponent {
    displayedColumns: string[] = ['categoryName', 'budgeted', 'spent', 'available'];
    dataSource: MatTableDataSource<BudgetRow> = new MatTableDataSource<BudgetRow>(TEST_DATA);
}

const TEST_DATA: BudgetRow[] = [
    {
        categoryId: 1,
        categoryName: 'Mortgage',
        budgeted: 1440.49,
        spent: 0,
        available: 1440.49,
    },
];
