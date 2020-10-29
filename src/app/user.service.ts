import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from './user';
import {catchError, map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  private usersUrl = 'http://localhost:3000/users';
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl)
      .pipe(
        catchError(this.handleError<User[]>('getUsers', []))
      );
  }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(this.usersUrl, user, this.httpOptions)
      .pipe(
        catchError(this.handleError<User>('registerUser'))
      );
  }

  getUser(email: string): Observable<User[]> {
    const url = `${this.usersUrl}/?email=${email}`;
    return this.http.get<User[]>(url)
      .pipe(
        catchError(this.handleError<User[]>('getUser', []))
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
