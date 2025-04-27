import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { APP_ROUTES } from './app.routes';

export const APP_CONFIG: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(APP_ROUTES),
        provideAnimationsAsync(),
        provideHttpClient(),
    ],
};
