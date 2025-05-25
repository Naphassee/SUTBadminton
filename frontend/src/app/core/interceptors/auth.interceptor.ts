import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // อ่าน token จาก localStorage
    const token = localStorage.getItem('token');
    // ถ้ามี token ให้ clone request แล้วแนบ header Authorization
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      // ส่งต่อต่อผ่าน authReq
      return next.handle(authReq);
    }
    // ถ้าไม่มี token ก็ส่ง req ปกติ
    return next.handle(req);
  }
}