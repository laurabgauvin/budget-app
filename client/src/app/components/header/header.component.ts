import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    imports: [RouterModule, MatButtonModule, MatIconModule],
    standalone: true,
})
export class HeaderComponent {
    private readonly _router = inject(Router);

    isActive(route: string): boolean {
        return this._router.url === `/${route}`;
    }
}
