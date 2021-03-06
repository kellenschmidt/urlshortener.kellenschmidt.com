import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../shared/authentication.service';
import { TableHandlerService } from '../../url-shortener/shared/table-handler.service';

@Component({
  selector: 'ks-login-form',
  templateUrl: 'login-form.component.html',
  styleUrls: ['login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  @Output() onLogin = new EventEmitter<boolean>();

  loginForm: FormGroup;
  visible: boolean = false;

  toggleVisible() {
    this.visible = !this.visible;
  }

  // Login as existing user and set values
  loginHttp() {
    this.authentication.login(this.email.value, this.password.value).subscribe(
      (responseBody) => {
        // Store token in local storage
        localStorage.setItem('auth', JSON.stringify(responseBody));

        // Set values for new user using http response values
        this.authentication.currentUser.initializeUser(responseBody.user);

        // Emit event to tell parent component to close modal
        this.onLogin.emit(true);

        // Clear old values in form
        this.loginForm.reset();
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.log('Error: POST request to login failed:', err.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          this.loginForm.get(err.error['element']).setErrors( {[err.error['error']]: true} );
        }
      } // error
    ) // http subscribe
  } //loginHttp

  createForm() {
    this.loginForm = this.fb.group({
      email: ["", [
        Validators.required,
        Validators.email,
      ]],
      password: ["", [
        Validators.required,
      ]],
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  constructor(public authentication: AuthenticationService,
    private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
  }

}
