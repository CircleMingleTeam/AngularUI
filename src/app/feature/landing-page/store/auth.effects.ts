import { Actions, Effect, ofType } from '@ngrx/effects';
import * as fromAuthAction from './auth.actions';
import { switchMap, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/core/user.model';
import { Router } from '@angular/router';


export interface AuthResponse {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

const HandleAuthentication = (email: string, userId: string, token: string, expirationDate: number)=>{
    const expireDate = new Date(new Date().getTime() + expirationDate * 1000);
    const user = new User(email, userId, token, expireDate);
    localStorage.setItem('userData', JSON.stringify(user))
    return new fromAuthAction.AuthenticationSuccess({
        email: email,
        userId: userId,
        token: token,
        expirationDate: expireDate
    })
};

@Injectable()
export class AuthEffects {

    constructor(private action$: Actions, private http: HttpClient, private router: Router) {}

    @Effect()
    authSignup = this.action$.pipe(
        ofType(fromAuthAction.SIGNUP_START),
        switchMap((authData: fromAuthAction.SignupStart) => {
            return this.http.post<AuthResponse>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAruh-ikSbTyhSWKiDSPCRAvB8Z7ZMsb8s",
            {
                email: authData.payload.email,
                password: authData.payload.password,
                returnSecureToken: true
            })
        }),
        map(resData => {
            return HandleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        })
    );

    @Effect({dispatch: false})
    authRedirect = this.action$.pipe(
        ofType(fromAuthAction.AUTHENTICATE_SUCCESS),
        tap(() => {
            this.router.navigate(['/home'])
        })
    );
}