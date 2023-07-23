import {createReducer, on} from '@ngrx/store';

import {login} from './login-actions';

export const userId = localStorage.getItem("uid") ?? "";

export const loginDataReducer = createReducer(
    userId,
    on(login , (state, { uid }) => state = uid)
);