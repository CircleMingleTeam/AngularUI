import { Actions, Effect, ofType } from '@ngrx/effects';
import * as fromAuthAction from './auth.actions';
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/core/user.model';
import { Router } from '@angular/router';
import { of } from 'rxjs';


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

const HandleError = (errorRes) => {
    console.log("errorRes: ",errorRes)
    let errorMessage = "An unknnown error occured!"
    if(!errorRes.error || !errorRes.error.error) {
        return of(new fromAuthAction.AuthenticationFail(errorMessage));
    }
    switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMessage = "This email already exists";
            break;
        case 'EMAIL_NOT_FOUND':
            errorMessage = "Invalid email address";
            break;
        case 'INVALID_PASSWORD':
            errorMessage = "Password is incorrect";
            break;
    }
    return of(new fromAuthAction.AuthenticationFail(errorMessage));
}

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
        }),
        catchError(errorRes => {
            return HandleError(errorRes);
        })
    );

    @Effect()
    authLogin = this.action$.pipe(
        ofType(fromAuthAction.LOGIN_START),
        switchMap((authData: fromAuthAction.LoginStart) => {
            return this.http.post<AuthResponse>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAruh-ikSbTyhSWKiDSPCRAvB8Z7ZMsb8s",
            {
                email: authData.payload.email,
                password: authData.payload.password,
                returnSecureToken: true
            })
        }),
        map(resData => {
            return HandleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }),
        catchError(errorRes => {
            return HandleError(errorRes);
        })
    )

    @Effect({dispatch: false})
    authRedirect = this.action$.pipe(
        ofType(fromAuthAction.AUTHENTICATE_SUCCESS),
        tap(() => {
            this.router.navigate(['/home'])
        })
    );
}