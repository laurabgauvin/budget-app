
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { AccountsCreateDialogComponent } from '../../components/accounts-create-dialog/accounts-create-dialog.component';
import { AccountsGridComponent } from '../../components/accounts-grid/accounts-grid.component';

@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html',
    styleUrl: './accounts.component.scss',
    imports: [AccountsGridComponent, MatButtonModule, RouterModule, MatDialogModule],
})
export class AccountsComponent {
    private readonly _dialog: MatDialog = inject(MatDialog);

    /**
     * Opens the create new account dialog
     */
    createAccount(): void {
        this._dialog.open(
            AccountsCreateDialogComponent /*, {
            height: '400px',
            width: '600px',
        }*/
        );
    }
}
