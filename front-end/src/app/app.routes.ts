import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'budget',
        loadComponent: () =>
            import('./pages/budget/budget.component').then((c) => c.BudgetComponent),
    },
    {
        path: 'transactions',
        loadComponent: () =>
            import('./pages/transactions/transactions.component').then(
                (c) => c.TransactionsComponent
            ),
    },
    {
        path: 'dashboard',
        loadComponent: () =>
            import('./pages/dashboard/dashboard.component').then((c) => c.DashboardComponent),
    },
    {
        path: '',
        loadComponent: () =>
            import('./pages/dashboard/dashboard.component').then((c) => c.DashboardComponent),
    },
];
