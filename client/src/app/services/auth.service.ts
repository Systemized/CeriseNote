import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  signedIn = signal(false);

  constructor(private http: HttpClient) { }

  // From login.components.ts, for google sdk login
  handleCredsRes(id_token: string) {
    this.http.post('http://localhost:3000/api/auth/google', { id_token }, { withCredentials: true 
    }).subscribe({
      next: (res) => console.log('Login Successful:', res),
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
    })
  }


  logout() {
    // Gets user email to logout google sdk via revoke
    this.http.get<{ email: string }>('http://localhost:3000/api/auth/user-email', { withCredentials: true
    }).subscribe(res => {
      const userEmail = res.email;

      this.http.post('http://localhost:3000/api/auth/logout', {}, {
        withCredentials: true
      }).subscribe(() => {
        google.accounts.id.disableAutoSelect();
        google.accounts.id.revoke(userEmail, () => {
          console.log('Google session revoked');
        })
        console.log('User session destroyed');
      })
    })
  }
}



// logout() {
//   console.log('logging out...');

//   this.http.get<{ loggedIn: boolean, user?: { email: string } }>('http://localhost:3000/api/auth/status')
//     .subscribe(res => {
//       const userEmail = res.user!.email

//       google.accounts.id.disableAutoSelect(); // Clears saved Google session
//       google.accounts.id.revoke(userEmail, (res: any) => {
//         console.log('Google session revoked:', res);
//       });
//     })
//   this.http.post('http://localhost:3000/api/auth/logout', () => {
//     console.log('Logged Out');
//   })

// }