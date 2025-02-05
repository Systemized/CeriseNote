import { Component, inject, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthVerifyService } from '../../services/auth-verify.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly authService = inject(AuthVerifyService)

  isAuthenticated = false;
  userData$ = this.oidcSecurityService.userData$;

  ngOnInit() {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated }) => {
      this.isAuthenticated = isAuthenticated;

      // To set authentication status, so that other components know 'isAuthenticated' boolean value
      this.authService.setAuthenticationStatus(isAuthenticated);

      if (isAuthenticated) {
        this.oidcSecurityService.getAccessToken().subscribe((token) => {
          localStorage.setItem('access_token', token);
        });
      }
    });
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  logout(): void {
    // Clear session storage
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }
    // set authentication value to false upon logout
    this.authService.setAuthenticationStatus(false);
    window.location.href = environment.logout;
  }

}
