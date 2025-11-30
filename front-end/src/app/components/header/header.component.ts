
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    imports: [RouterModule, MatButtonModule, MatIconModule],
    standalone: true,
})
export class HeaderComponent {
    constructor(private readonly _router: Router) {}

    isActive(route: string): boolean {
        return this._router.url === `/${route}`;
    }
}
