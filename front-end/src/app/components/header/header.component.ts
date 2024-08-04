import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    standalone: true,
    imports: [MatIcon],
})
export class HeaderComponent {}
