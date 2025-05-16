import { Component, AfterViewInit } from '@angular/core';

declare const google: any;

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements AfterViewInit {

  ngAfterViewInit() {
    google.accounts.id.initialize({
      client_id: '399022408559-1novgg3gvaf7db81e1pls405rtkjvssk.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this),
      context: 'signin',
      ux_mode: 'popup',
      login_uri: 'http://localhost:4200/login',
      itp_support: true
    });

    google.accounts.id.renderButton(
      document.getElementById('google-signin'),
      {
        theme: 'filled_black',
        // theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'rectangular',
        text: 'signin_with',
        logo_alignment: 'left',
        width: '250px',
      }
    );

    // Optional: Prompt the user automatically
    // google.accounts.id.prompt();
    google.accounts.id.disableAutoSelect(); // Clears auto-login
  }

  handleCredentialResponse(response: any) {
    console.log('Credential response:', response);
    // handle your auth logic here
  }
}
