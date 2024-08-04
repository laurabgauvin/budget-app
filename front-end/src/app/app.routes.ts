import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/budget/budget.component').then((c) => c.BudgetComponent),
    },
];
