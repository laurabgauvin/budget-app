import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AccountInfo } from 'budget-app-shared/interface';
import { AccountService } from '../../services/account.service';

@Component({
    selector: 'app-accounts-grid',
    templateUrl: './accounts-grid.component.html',
    styleUrl: './accounts-grid.component.css',
    imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule],
})
export class AccountsGridComponent {
    private readonly _accountService: AccountService = inject(AccountService);

    displayedColumns: string[] = ['name', 'type', 'balance', 'tracked', 'actions'];
    readonly accounts: Signal<AccountInfo[]> = toSignal(this._accountService.getAllAccounts(), {
        initialValue: [],
    });
    readonly dataSource: Signal<MatTableDataSource<AccountInfo>> = computed(
        () => new MatTableDataSource<AccountInfo>(this.accounts())
    );
}
