import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromAppReducer from './../../core/app-store/appReducer';
import * as fromAuthAction from './store/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenExpirationTimer: any;

  constructor(private store: Store<fromAppReducer.AppState>) { }

  SetLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new fromAuthAction.Logout());
    }, expirationDuration)
  }

  ClearLogoutTimeout() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer)
    }
    this.tokenExpirationTimer = null;
  }
}
