import { createReducer, on } from "@ngrx/store";
import { searchForLabels } from "./searching-labels.actions";


export const searchingState = "";

export const searchingReducer = createReducer(
    searchingState,
    on(searchForLabels, (state, {searchText}) => state = searchText),
);