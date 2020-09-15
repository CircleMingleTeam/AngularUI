import { User } from 'src/app/core/user.model';
import * as fromAuthAction from './auth.actions';


export interface State {
    user: User,
    authError: string,
    loading: boolean
}

const initialState: State = {
    user: null,
    authError: null,
    loading: false
}

export function AuthReducer(state: State = initialState, action: fromAuthAction.AuthActions) {
    switch (action.type) {
        case fromAuthAction.SIGNUP_START:
            return {
                ...state,
                authError: null,
                loading: true
            };
        case fromAuthAction.LOGIN_START:
            return {
                ...state,
                authError: null,
                loading: true
            };
        case fromAuthAction.AUTHENTICATE_SUCCESS:
            const user = new User(action.payload.email, action.payload.userId, action.payload.token, action.payload.expirationDate)
            return {
                ...state,
                user: user,
                authError: null,
                loading: false
            };
        case fromAuthAction.AUTHENTICATE_FAIL:
            return {
                ...state,
                authError: action.payload,
                loading: false
            };
        case fromAuthAction.LOGOUT:
            return {
                ...state,
                user: null
            }
        default: {
            return initialState;
        }
    }

}