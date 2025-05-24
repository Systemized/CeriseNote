import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  signedIn = signal(false);

  constructor(private http: HttpClient, private router: Router) { }

  // From login.components.ts, for google sdk login
  handleCredsRes(id_token: string) {
    this.http.post<{ message: string, user: { email: string}}>('http://localhost:3000/api/auth/google', { id_token }, {
      withCredentials: true
    }).subscribe({
      next: (res) => {
        console.log('Login Successful:', res);
        localStorage.setItem('userEmail', res.user.email)
        this.checkValidSession();
        this.router.navigate(['/dashboard']);
      },
      error: (err) => console.log('Login Failed:', err),
    });
  }

  // Checks that the client's token is valid
  checkValidSession() {
    this.http.get<{ loggedIn: boolean }>('http://localhost:3000/api/auth/check-session', {
      withCredentials: true
    }).subscribe(res => {
      console.log('Login Status:', res.loggedIn);
      this.signedIn.set(res.loggedIn)

      if (!res.loggedIn) {
        const userEmail = localStorage.getItem('userEmail');
        google.accounts.id.disableAutoSelect();
        google.accounts.id.revoke(userEmail, () => {
          console.log('Express-Session not found, google session revoked');
        });
        localStorage.removeItem('userEmail');
      }
    })
  }


  logout() {

    // Reinitialize google sdk
    google.accounts.id.initialize({
      client_id: '399022408559-1novgg3gvaf7db81e1pls405rtkjvssk.apps.googleusercontent.com'
    });

    // Gets user email to logout google sdk via revoke
    this.http.get<{ email: string }>('http://localhost:3000/api/auth/user-email', {
      withCredentials: true
    }).subscribe(res => {
      const userEmail = res.email;

      // Deletes session on server by clearing cookie, and logout google oauth2
      this.http.post('http://localhost:3000/api/auth/logout', {}, {
        withCredentials: true
      }).subscribe(() => {
        google.accounts.id.disableAutoSelect();
        google.accounts.id.revoke(userEmail, () => {
          console.log('Google session revoked');
        })
        console.log('User session destroyed');
        this.checkValidSession();
        this.router.navigate(['/login']);
      })
    });
  }
}

