import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Manager } from '../../../models/manager.model';

@Injectable({
  providedIn: 'root',
})
export class PlayerListService {
  private apiUrl = 'http://localhost:5000/api/managermana';
  constructor(private http: HttpClient) {}
  // GET: ดึงข้อมูล Manager ทั้งหมด
  getManagers(): Observable<Manager[]> {
    return this.http
      .get<{ message: string; employee: Manager[] }>(`${this.apiUrl}/allTeam`) // Express API ของคุณส่งกลับมาในรูปแบบ { message: ..., employee: ... }
      .pipe(
        map((response) => response.employee), // ดึงเฉพาะ array ของ managers ออกมา
        catchError(this.handleError)
      );
  }

  // GET: ดึงข้อมูล Manager ตาม ID
  getManagerById(id: string): Observable<Manager> {
    return this.http
      .get<{ message: string; employee: Manager }>(
        `${this.apiUrl}/teamBy/${id}`
      )
      .pipe(
        map((response) => response.employee), // ดึงเฉพาะ object manager ออกมา
        catchError(this.handleError)
      );
  }

  // POST: สร้าง Manager ใหม่
  createManager(manager: Manager): Observable<Manager> {
    return this.http
      .post<{ message: string; employee: Manager }>(
        `${this.apiUrl}/pushTeam`,
        manager
      )
      .pipe(
        map((response) => response.employee),
        catchError(this.handleError)
      );
  }

  // PUT: อัปเดตข้อมูล Manager
  updateManager(id: string, manager: Partial<Manager>): Observable<Manager> {
    return this.http
      .put<{ message: string; employee?: Manager; updated?: Manager }>(
        `${this.apiUrl}/newTeam/${id}`,
        manager
      ) // Backend ของคุณอาจจะ return property 'employee' หรือ 'updated'
      .pipe(
        map((response) => response.employee || response.updated!), // เลือก property ที่มีข้อมูล
        catchError(this.handleError)
      );
  }

  // DELETE: ลบ Manager
  deleteManager(
    id: string
  ): Observable<{ message: string; deleted?: Manager }> {
    return this.http
      .delete<{ message: string; deleted?: Manager }>(
        `${this.apiUrl}/removeTeam/${id}`
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    // อาจจะมีการจัดการ error ที่ดีกว่านี้ เช่น แสดงผลให้ user เห็น
    return throwError(
      () =>
        new Error(
          'Something bad happened; please try again later. Message: ' +
            (error.error?.message || error.message)
        )
    );
  }
}
