import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(public auth: AuthService ) {
    this.checkValidSession()
  }

  checkValidSession() {
    this.auth.checkValidSession();
  }

  logout() {
    this.auth.logout();
  }
}
