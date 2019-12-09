import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {Task} from './model/task';
import {environment} from '../environments/environment';
import {DeleteRecord} from './model/deleterecord';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private tasks:Task[];


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };

   

  constructor(private http: HttpClient) { }
 
  /////// Save methods //////////

  /** POST: add a new task to the server */
  addtask (task: Task): Observable<Task> {
    return this.http.post<Task>(environment.taskAddUrl, task, this.httpOptions).pipe(
      tap((newtask: Task) => this.log(`added task w/ id=${newtask.taskName}`)),
      catchError(this.handleError<Task>('addtask'))
    );
  }

  /** GET taskes from the server  */
  gettasks (): Observable<Task[]> {
    return this.http.get<Task[]>(environment.taskGetUrl)
      .pipe(
        tap((tasks: Task[]) => this.log('fetched taskes'+JSON.stringify(tasks))),
        catchError(this.handleError<Task[]>('gettasks:', []))
      );
  }

   /** GET Parent taskes from the server  */
   getParenttasks (): Observable<Task[]> {
    return this.http.get<Task[]>(environment.parentTaskAllUrl)
      .pipe(
        tap((tasks: Task[]) => this.log('fetched taskes'+JSON.stringify(tasks))),
        catchError(this.handleError<Task[]>('gettasks:', []))
      );
  }

  gettaskById(taskId: any): Observable<Task> {
    const url = `${environment.taskByidGetUrl}/${taskId}`;
    return this.http.get<Task>(url).pipe(
      tap((task: Task) => this.log(`fetched task id=${taskId}`+JSON.stringify(task))),
      catchError(this.handleError<Task>(`gettask id=${taskId}`))
    );
  }

  deleteTask (taskId: any):  Observable<DeleteRecord> {
    const url = `${environment.taskByidGetUrl}/${taskId}`;

  return this.http.delete<DeleteRecord>(url, this.httpOptions).pipe(
    tap(_ => this.log(`deleted task id=${taskId}`)),
    catchError(this.handleError<any>('deleteTask'))
  );
}

  getParentTaskById(parentId: any): Observable<Task> {
    const url = `${environment.taskByParentIDGetUrl}/${parentId}`;
    return this.http.get<Task>(url).pipe(
      tap((task: Task) => this.log(`fetched parent id=${parentId}`+JSON.stringify(task))),
      catchError(this.handleError<Task>(`gettask parent id=${parentId}`))
    );
  }

  updatetask (task: Task): Observable<any> {
    return this.http.put(environment.taskByidGetUrl, task, this.httpOptions).pipe(
      tap(_ => this.log(`updated task id=${task.taskId}`)),
      catchError(this.handleError<any>('updatetask'))
    );
  }

  searchtask (names: String): Observable<any> {
    return this.http.post<Task[]>(environment.searchtaskUrl, names, this.httpOptions).pipe(
      tap((tasks: Task[]) => this.log('fetched taskes'+JSON.stringify(tasks))),
      catchError(this.handleError<Task[]>('gettasks:', []))
    );
  }

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

      // TODO: better job of transforming error for task consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a taskService message with the MessageService */
  private log(message: string) {
    console.log(`taskService: ${message}`);
  }
}
