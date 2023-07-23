import { createAction, props } from '@ngrx/store';

export const login = createAction('[login data] login', props<{uid : string}>());