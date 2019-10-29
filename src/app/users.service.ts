import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from './model/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {


private users:User[];
 private userAddUrl = 'users/add';  // URL to web api

 private userGetUrl = 'users/allusers';

 private userByidGetUrl = 'users/user';

 private searchUserUrl='users/searchusers';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };

   

  constructor(private http: HttpClient) { }
  getBaseUrl() {  
    return 'http://localhost:8090/';  
 }
  /////// Save methods //////////

  /** POST: add a new User to the server */
  addUser (User: User): Observable<User> {
    return this.http.post<User>(this.getBaseUrl()+this.userAddUrl, User, this.httpOptions).pipe(
      tap((newUser: User) => this.log(`added User w/ id=${newUser.firstName}`)),
      catchError(this.handleError<User>('addUser'))
    );
  }

  /** GET Useres from the server  */
  getUsers (): Observable<User[]> {
    return this.http.get<User[]>(this.getBaseUrl()+this.userGetUrl)
      .pipe(
        tap((users: User[]) => this.log('fetched Useres'+JSON.stringify(users))),
        catchError(this.handleError<User[]>('getUsers:', []))
      );
  }

  getUserById(userId: any): Observable<User> {
    const url = `${this.getBaseUrl()+this.userByidGetUrl}/${userId}`;
    return this.http.get<User>(url).pipe(
      tap((user: User) => this.log(`fetched User id=${userId}`+JSON.stringify(user))),
      catchError(this.handleError<User>(`getUser id=${userId}`))
    );
  }

  updateUser (user: User): Observable<any> {
    return this.http.put(this.getBaseUrl()+this.userByidGetUrl, user, this.httpOptions).pipe(
      tap(_ => this.log(`updated User id=${user.userId}`)),
      catchError(this.handleError<any>('updateUser'))
    );
  }

  searchUser (names: String[]): Observable<any> {
    return this.http.post<User[]>(this.getBaseUrl()+this.searchUserUrl, names, this.httpOptions).pipe(
      tap((users: User[]) => this.log('fetched Useres'+JSON.stringify(users))),
      catchError(this.handleError<User[]>('getUsers:', []))
    );
  }

  /** GET User by id. Return `undefined` when id not found  
  getUserNo404<Data>(id: number): Observable<User> {
    const url = `${this.UseresUrl}/?id=${id}`;
    return this.http.get<User[]>(url)
      .pipe(
        map(Useres => Useres[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} User id=${id}`);
        }),
        catchError(this.handleError<User>(`getUser id=${id}`))
      );
  }

  /** GET User by id. Will 404 if id not found  
  getUser(id: number): Observable<User> {
    const url = `${this.UseresUrl}/${id}`;
    return this.http.get<User>(url).pipe(
      tap(_ => this.log(`fetched User id=${id}`)),
      catchError(this.handleError<User>(`getUser id=${id}`))
    );
  }

  /* GET Useres whose name contains search term 
  searchUseres(term: string): Observable<User[]> {
    if (!term.trim()) {
      // if not search term, return empty User array.
      return of([]);
    }
    return this.http.get<User[]>(`${this.UseresUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found Useres matching "${term}"`)),
      catchError(this.handleError<User[]>('searchUseres', []))
    );
  }

  /
  /** DELETE: delete the User from the server 
  deleteUser (User: User | number): Observable<User> {
    const id = typeof User === 'number' ? User : User.id;
    const url = `${this.UseresUrl}/${id}`;

    return this.http.delete<User>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted User id=${id}`)),
      catchError(this.handleError<User>('deleteUser'))
    );
  }

  /** PUT: update the User on the server 
  updateUser (User: User): Observable<any> {
    return this.http.put(this.UseresUrl, User, this.httpOptions).pipe(
      tap(_ => this.log(`updated User id=${User.id}`)),
      catchError(this.handleError<any>('updateUser'))
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

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a UserService message with the MessageService */
  private log(message: string) {
    console.log(`UserService: ${message}`);
  }
}