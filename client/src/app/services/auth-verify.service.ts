import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthVerifyService {
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this._isAuthenticated.asObservable();

  setAuthenticationStatus(status: boolean) {
    this._isAuthenticated.next(status);
  }
}
