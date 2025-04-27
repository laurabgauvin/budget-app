import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Account, AccountTypeInfo } from './interfaces/account.interface';

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    private readonly _apiService: ApiService = inject(ApiService);

    getAllAccounts(): Observable<Account[]> {
        return this._apiService.getAllAccounts().pipe(
            map((dtoList) => {
                if (dtoList.length > 0) {
                    return dtoList.map((dto) => ({
                        ...dto,
                        id: dto.accountId,
                    }));
                }
                return [];
            })
        );
    }

    getAccountTypes(): Observable<AccountTypeInfo[]> {
        return this._apiService.getAccountTypes();
    }
}
