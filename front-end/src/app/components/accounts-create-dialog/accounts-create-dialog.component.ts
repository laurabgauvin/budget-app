import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AccountService } from '../../services/account.service';
import { AccountType } from '../../services/dto/account-info.dto';
import { AccountTypeInfo } from '../../services/interfaces/account.interface';

@Component({
    selector: 'app-accounts-create-dialog',
    templateUrl: './accounts-create-dialog.component.html',
    styleUrl: './accounts-create-dialog.component.scss',
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSelectModule,
    ],
})
export class AccountsCreateDialogComponent {
    private readonly _accountService: AccountService = inject(AccountService);

    readonly accountTypes: Signal<AccountTypeInfo[]> = toSignal(
        this._accountService.getAccountTypes(),
        {
            initialValue: [],
        }
    );

    form = new FormGroup({
        name: new FormControl<string>(''),
        type: new FormControl<AccountType>('cash'),
        balance: new FormControl<number>(0),
    });
}
