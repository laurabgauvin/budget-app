import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AccountsGridComponent } from '../../components/accounts-grid/accounts-grid.component';

@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html',
    styleUrl: './accounts.component.scss',
    imports: [AccountsGridComponent, CommonModule, MatButtonModule, RouterModule],
})
export class AccountsComponent {}
