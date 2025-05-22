// src/main.ts
import { enableProdMode }              from '@angular/core';
import { bootstrapApplication }        from '@angular/platform-browser';
import { provideRouter }               from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS
} from '@angular/common/http';

import { AppComponent }     from './app/app.component';
import { routes }           from './app/app.routes';
import { AuthInterceptor }  from './app/core/auth.interceptor';

// ถ้ามี production flag ก็ใช้บล็อกนี้
// if (environment.production) {
//   enableProdMode();
// }

bootstrapApplication(AppComponent, {
  providers: [
    // 1) ลงทะเบียน routing
    provideRouter(routes),

    // 2) ตรงนี้จะสร้าง HttpClient พร้อมสอด interceptor ที่ลงทะเบียนผ่าน DI
    provideHttpClient(withInterceptorsFromDi()),

    // 3) ลงทะเบียน AuthInterceptor ใน chain
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
.catch(err => console.error(err));
