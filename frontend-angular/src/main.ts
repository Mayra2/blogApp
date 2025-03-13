import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { withInterceptors, provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { CommonModule } from '@angular/common';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    CommonModule,
  ],
}).catch((err) => console.error(err));