import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromAppReducer from './../../core/app-store/appReducer';
import * as fromAuthAction from './store/auth.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  signupMode: boolean = false;
  loginMode: boolean = false;
  credentialFormMode: string = null;
  error: string = null;
  storeSubs: Subscription;

  constructor(private store: Store<fromAppReducer.AppState>) { }

  ngOnInit(): void {
  this.storeSubs = this.store.select('auth').subscribe(authState => {
      console.log("authState", authState)
      this.error = authState.authError;
      if(this.error) {
        console.log("error message ", this.error)
      }
    })
  }

  onLogIn() {
    this.credentialFormMode = 'Log In';
    this.loginMode = true;
    this.signupMode = false;
  }

  onSignUp() {
    this.credentialFormMode = 'Sign In';
    this.signupMode = true;
    this.loginMode = false;
  }

  onSubmit(authForm: NgForm) {
    if(!authForm.valid) {
      return
    }
    const email = authForm.value.email;
    const password = authForm.value.password;

    if(this.signupMode && !this.loginMode) {
      this.store.dispatch(new fromAuthAction.SignupStart({email: email, password: password}));
      authForm.reset();
    }
    if(!this.signupMode && this.loginMode) {
      this.store.dispatch(new fromAuthAction.LoginStart({email: email, password: password}));
    }
  }

}
