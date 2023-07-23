import {createReducer, on} from '@ngrx/store';
import { handleAddPhoto } from './navbar.actions';

export const initialState = false;

export const handlePhotoReducer = createReducer(
    initialState,
    on(handleAddPhoto, (state) => !state)
);