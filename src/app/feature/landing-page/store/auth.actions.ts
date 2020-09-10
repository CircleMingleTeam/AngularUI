import { Action } from '@ngrx/store';

export const SIGNUP_START = "[Auth] SIGNUP_START";
export const LOGIN_START = "[Auth] LOGIN_START";
export const AUTHENTICATE_SUCCESS = "[Auth] AUTHENTICATE_SUCCESS";

export class SignupStart implements Action {
   readonly type = SIGNUP_START;

   constructor(public payload: {email: string, password: string}) {}
}

export class LoginStart implements Action {
    readonly type = LOGIN_START;

    constructor(public payload: {email: string, password: string}) {}
}

export class AuthenticationSuccess implements Action {
    readonly type = AUTHENTICATE_SUCCESS;

    constructor(public payload: {
        email: string,
        userId: string,
        token: string,
        expirationDate: Date
    }) {}
}


export type AuthActions = SignupStart | LoginStart | AuthenticationSuccess;