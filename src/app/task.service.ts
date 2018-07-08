import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {UserService} from './user.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

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


  retrieveTaskByTaskListId(taskListId: string) {
    const token = this.userService.getToken();

    const httpOptions = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      });

    const options = { params: new HttpParams().set('key', 'AIzaSyBIggrn7I0PdWPhghyt5laFsBZ1gimhRUE'), headers: httpOptions };

    return this.http.get<TaskList>('https://www.googleapis.com/tasks/v1/lists/' + taskListId + '/tasks', options).pipe(
      tap(_ => _,
        catchError(this.handleError<TaskList>('retrieveTaskByTaskListId'))
      ));

  }

  addTask(taskListId: string, taskInfo: any) {
    const token = this.userService.getToken();

    const httpOptions = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      });

    const options = { params: new HttpParams().set('key', 'AIzaSyBIggrn7I0PdWPhghyt5laFsBZ1gimhRUE'), headers: httpOptions };

    return this.http.post<TaskList>('https://www.googleapis.com/tasks/v1/lists/' + taskListId + '/tasks', taskInfo, options).pipe(
      tap(_ => _,
        catchError(this.handleError<TaskList>('addTask'))
      ));
  }

  updateTask(taskListId: string, taskId: string, taskInfo: any) {
    const token = this.userService.getToken();

    taskInfo.id = taskId;

    const httpOptions = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      });

    const options = { params: new HttpParams().set('key', 'AIzaSyBIggrn7I0PdWPhghyt5laFsBZ1gimhRUE'), headers: httpOptions };

    return this.http.put<TaskList>('https://www.googleapis.com/tasks/v1/lists/' + taskListId + '/tasks/' + taskId , taskInfo, options)
      .pipe(
      tap(_ => _,
        catchError(this.handleError<TaskList>('updateTask'))
      ));
  }
}
