import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
    {
        path: 'accounts',
        loadComponent: () =>
            import('./pages/accounts/accounts.component').then((c) => c.AccountsComponent),
    },
    {
        path: 'budget',
        loadComponent: () =>
            import('./pages/budget/budget.component').then((c) => c.BudgetComponent),
    },
    {
        path: 'dashboard',
        loadComponent: () =>
            import('./pages/dashboard/dashboard.component').then((c) => c.DashboardComponent),
    },
    {
        path: 'transactions',
        loadComponent: () =>
            import('./pages/transactions/transactions.component').then(
                (c) => c.TransactionsComponent
            ),
    },
    {
        path: '',
        loadComponent: () =>
            import('./pages/dashboard/dashboard.component').then((c) => c.DashboardComponent),
    },
];
