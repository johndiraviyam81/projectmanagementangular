import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {Project} from './model/project';

import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private Projects:Project[];

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };

   

  constructor(private http: HttpClient) { }
 
  /////// Save methods //////////

  /** POST: add a new Project to the server */
  addProject (Project: Project): Observable<Project> {
    return this.http.post<Project>(environment.ProjectAddUrl, Project, this.httpOptions).pipe(
      tap((newProject: Project) => this.log(`added Project w/ id=${newProject.projectName}`)),
      catchError(this.handleError<Project>('addProject'))
    );
  }

  /** GET Projectes from the server  */
  getProjects (): Observable<Project[]> {
    return this.http.get<Project[]>(environment.ProjectGetUrl)
      .pipe(
        tap((Projects: Project[]) => this.log('fetched Projectes'+JSON.stringify(Projects))),
        catchError(this.handleError<Project[]>('getProjects:', []))
      );
  }

  getProjectById(ProjectId: any): Observable<Project> {
    const url = `${environment.ProjectByidGetUrl}/${ProjectId}`;
    return this.http.get<Project>(url).pipe(
      tap((Project: Project) => this.log(`fetched Project id=${ProjectId}`+JSON.stringify(Project))),
      catchError(this.handleError<Project>(`getProject id=${ProjectId}`))
    );
  }

  updateProject (Project: Project): Observable<any> {
    return this.http.put(environment.ProjectByidGetUrl, Project, this.httpOptions).pipe(
      tap(_ => this.log(`updated Project id=${Project.projectId}`)),
      catchError(this.handleError<any>('updateProject'))
    );
  }

  searchProject (names: String): Observable<any> {
    return this.http.post<Project[]>(environment.searchProjectUrl, names, this.httpOptions).pipe(
      tap((Projects: Project[]) => this.log('fetched Projectes'+JSON.stringify(Projects))),
      catchError(this.handleError<Project[]>('getProjects:', []))
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

      // TODO: better job of transforming error for Project consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a ProjectService message with the MessageService */
  private log(message: string) {
    console.log(`ProjectService: ${message}`);
  }
}
