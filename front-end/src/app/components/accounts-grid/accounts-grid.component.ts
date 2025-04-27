import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AccountService } from '../../services/account.service';
import { Account } from '../../services/interfaces/account.interface';

@Component({
    selector: 'app-accounts-grid',
    templateUrl: './accounts-grid.component.html',
    styleUrl: './accounts-grid.component.scss',
    imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule],
})
export class AccountsGridComponent {
    private readonly _accountService: AccountService = inject(AccountService);

    displayedColumns: string[] = ['name', 'type', 'balance', 'tracked', 'actions'];
    readonly accounts: Signal<Account[]> = toSignal(this._accountService.getAllAccounts(), {
        initialValue: [],
    });
    readonly dataSource = computed(() => new MatTableDataSource<Account>(this.accounts()));
}
