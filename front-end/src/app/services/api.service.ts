import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ENVIRONMENT } from '../../environments/environment';
import { AccountInfoDto, AccountTypeInfoDto } from './dto/account-info.dto';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private readonly _baseUrl = ENVIRONMENT.apiUrl;
    private readonly _http: HttpClient = inject(HttpClient);

    getAllAccounts(): Observable<AccountInfoDto[]> {
        try {
            return this._http.get<AccountInfoDto[]>(`${this._baseUrl}/account`);
        } catch (e) {
            console.error('Error getting all accounts:', e);
            return of([]);
        }
    }

    getAccountTypes(): Observable<AccountTypeInfoDto[]> {
        try {
            return this._http.get<AccountTypeInfoDto[]>(`${this._baseUrl}/account/types`);
        } catch (e) {
            console.error('Error getting list of account types:', e);
            return of([]);
        }
    }
}
