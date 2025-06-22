import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  signedIn = signal(false);

  constructor(private http: HttpClient, private router: Router) { }

  private apiUrl = environment.apiUrl;
  
  reInitialize() {
    google.accounts.id.initialize({
      client_id: '399022408559-1novgg3gvaf7db81e1pls405rtkjvssk.apps.googleusercontent.com'
    });
  }

  // From login.components.ts, for google sdk login
  handleCredsRes(id_token: string) {
    this.http.post<{ message: string, user: { email: string } }>(`${this.apiUrl}/auth/google`, { id_token }, {
      withCredentials: true
    }).subscribe({
      next: (res) => {
        this.signedIn.set(true);
        console.log('Login Successful:', res);
        localStorage.setItem('userEmail', res.user.email)
        this.router.navigate(['/dashboard']);
      },
      error: (err) => console.log('Login Failed:', err),
    });
  }

  // Checks that the client's token is valid
  async checkValidSession(): Promise<boolean> {
    const isValid = await firstValueFrom(
      this.http.get<{ loggedIn: boolean, user: [] }>(`${this.apiUrl}/auth/check-session`, {
        withCredentials: true
      })
    );
    this.signedIn.set(isValid.loggedIn)

    // For the case of the user not manually logging out, but the session already expired
    if (!isValid.loggedIn && localStorage.getItem('userEmail')) {
      const userEmail = localStorage.getItem('userEmail');

      this.reInitialize()
      google.accounts.id.disableAutoSelect();
      google.accounts.id.revoke(userEmail, () => {
        console.log(`Express-Session not found, google session for ${userEmail} revoked`);
      });
      localStorage.removeItem('userEmail');
    }
    return isValid.loggedIn;
  }


  // User manually logging out
  logout() {
    this.reInitialize();    // Reinitialize google sdk

    // Gets user email to logout google sdk via revoke
    this.http.get<{ email: string }>(`${this.apiUrl}/auth/user-email`, {
      withCredentials: true
    }).subscribe(res => {
      const userEmail = res.email;

      // Deletes session on server by clearing cookie, and logout google oauth2
      this.http.post<{ message: string }>(`${this.apiUrl}/auth/logout`, {}, {
        withCredentials: true
      }).subscribe(logoutRes => {
        console.log(logoutRes.message);
        google.accounts.id.disableAutoSelect();
        google.accounts.id.revoke(userEmail, () => {
          console.log('Google session revoked');
        })
        this.checkValidSession();
        this.router.navigate(['/']);
      })
    });
  }
}

