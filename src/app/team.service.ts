import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Team} from './team';
import {catchError} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private http: HttpClient) {
  }

  private teamsUrl = 'http://localhost:3000/team';
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  getTeams(): Observable<Team[]>{
    return this.http.get<Team[]>(this.teamsUrl)
      .pipe(
        catchError(this.handleError<Team[]>('getTeams', []))
      );
  }
  createTeam(team: Team): Observable<Team> {
    return this.http.post<Team>(this.teamsUrl, team, this.httpOptions)
      .pipe(
        catchError(this.handleError<Team>('createTeam'))
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
