import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { ImagesListComponent } from './Components/images-list/images-list.component';
import { NewImageModalComponent } from './Components/new-image-modal/new-image-modal.component';

import {StoreModule} from '@ngrx/store';
import { handlePhotoReducer } from 'src/state-management/navbar-state/navbar.reducers';
import { RegisterationComponent } from './Components/registeration/registeration.component';
import { ErrorHandlingComponent } from './Components/error-handling/error-handling.component';
import { loginDataReducer } from 'src/state-management/login-state/login-reducer';
import { searchingReducer } from 'src/state-management/searching-labels-state/searching-labels.reducers';
import { EmptyComponent } from './Components/empty/empty.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ImagesListComponent,
    NewImageModalComponent,
    RegisterationComponent,
    ErrorHandlingComponent,
    EmptyComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({hanldeAddPhoto : handlePhotoReducer, loginData : loginDataReducer, searchingForLabels: searchingReducer}),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
