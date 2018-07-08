import { Injectable } from '@angular/core';
import {UserService} from './user.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasklistService {

  constructor(private userService: UserService, private http: HttpClient) { }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


  retrieveUsersTaskLists() {
    const token = this.userService.getToken();

    const httpOptions = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        });

    const options = { params: new HttpParams().set('key', 'AIzaSyBIggrn7I0PdWPhghyt5laFsBZ1gimhRUE'), headers: httpOptions };

    return this.http.get<TaskList>('https://www.googleapis.com/tasks/v1/users/@me/lists', options).pipe(
      tap(_ => _,
        catchError(this.handleError<TaskList>('retrieveUsersTaskLists'))
      ));

  }
}
