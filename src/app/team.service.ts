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

  getTeams(): Observable<Team[]> {
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

  getTeam(id: number): Observable<Team> {
    const url = `${this.teamsUrl}/${id}`;
    return this.http.get<Team>(url)
      .pipe(
        catchError(this.handleError<Team>(`getTeam; id = ${id}`))
      );
  }

  getTeamByName(teamName: string): Observable<Team[]> {
    const url = `${this.teamsUrl}/?teamName=${teamName}`;
    return this.http.get<Team[]>(url)
      .pipe(
        catchError(this.handleError<Team[]>(`getTeamByName; name = ${teamName}`, []))
      );
  }

  updateTeam(team: Team): Observable<Team> {
    const url = `${this.teamsUrl}/${team.id}`;
    return this.http.put<Team>(url, team, this.httpOptions)
      .pipe(
        catchError(this.handleError<Team>(`updateTeam; teamID : ${team.id}`))
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
