import { createAction, props } from "@ngrx/store";


export const searchForLabels = createAction('[Navbar component] searching', props<{searchText: string}>());