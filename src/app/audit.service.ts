import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Audit} from './audit';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuditService {

  constructor(private http: HttpClient) {
  }

  private auditUrl = 'http://localhost:3000/audit';
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  getAudits(): Observable<Audit[]> {
    return this.http.get<Audit[]>(this.auditUrl)
      .pipe(
        catchError(this.handleError<Audit[]>('getAudits', []))
      );
  }

  getAudit(id: number): Observable<Audit> {
    const url = `${this.auditUrl}/${id}`;
    return this.http.get<Audit>(url)
      .pipe(
        catchError(this.handleError<Audit>(`getAudit; id: ${id}`))
      );
  }
  createAudit(audit: Audit): Observable<Audit> {
    return this.http.post<Audit>(this.auditUrl, audit, this.httpOptions)
      .pipe(
        catchError(this.handleError<Audit>(`createAudit audit=${audit}`))
      );
  }

  // tslint:disable-next-line:typedef
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
