import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { concat, concatMap, Observable, switchMap } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { List, Task } from '../interfaces';


@Injectable({
  providedIn: 'root'
})
export class ListTaskService {
  private listApiUrl = 'http://localhost:3000/api/lists';
  private taskApiUrl = 'http://localhost:3000/api/tasks';

  constructor(private httpClient: HttpClient, private oidcSecurityService: OidcSecurityService) { }

  private getAuthHeaders(): Observable<HttpHeaders> {
    return this.oidcSecurityService.getAccessToken().pipe(
      switchMap((token) => {
        return new Observable<HttpHeaders>((observer) => {
          observer.next(
            new HttpHeaders({
              Authorization: 'Bearer ' + token,
            })
          );
          observer.complete();
        });
      })
    );
  }

  // -----------------------> List Methods <----------------------- 

  getLists(): Observable<List[]> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => this.httpClient.get<List[]>(this.listApiUrl, { headers }))
    );
  }

  createList(list: { name: string }): Observable<any> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => this.httpClient.post(this.listApiUrl, list, { headers }))
    );
  }

  deleteList(listId: string): Observable<void> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>    // Deletes Tasks First
        this.httpClient.delete<void>(`${this.taskApiUrl}?/listId=${listId}`, { headers }).pipe(
          concatMap(() =>       // Deletes List Afterwards
            this.httpClient.delete<void>(`${this.listApiUrl}/${listId}`)
          )
        )
      )
    );
  }

  // -----------------------> Task Methods <----------------------- 

  getTasks(listId: string): Observable<Task[]> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => this.httpClient.get<Task[]>(this.taskApiUrl, { headers, params: { listId } }))
    );
  }

  createTask(task: { name: string, desc?: string, listId: string }): Observable<any> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => this.httpClient.post(`${this.taskApiUrl}`, task, { headers }))
    )
  }

  updateTask(task: { _id: string, name: string, desc?: string, listId: string }): Observable<any> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => this.httpClient.put(`${this.taskApiUrl}/${task._id}`, task, { headers }))
    )
  }

  deleteTask(taskId: string): Observable<void> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => this.httpClient.delete<void>(`${this.taskApiUrl}/${taskId}`, { headers }))
    )
  }

}
