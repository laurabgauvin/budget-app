import { inject, Injectable } from '@angular/core';
import { AccountInfo, AccountTypeInfo } from 'budget-app-shared/interface';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    private readonly _apiService: ApiService = inject(ApiService);

    getAllAccounts(): Observable<AccountInfo[]> {
        return this._apiService.getAllAccounts();
    }

    getAccountTypes(): Observable<AccountTypeInfo[]> {
        return this._apiService.getAccountTypes();
    }
}
