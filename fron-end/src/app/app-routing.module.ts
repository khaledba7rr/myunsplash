import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImagesListComponent } from './Components/images-list/images-list.component';
import { RegisterationComponent } from './Components/registeration/registeration.component';
import { ErrorHandlingComponent } from './Components/error-handling/error-handling.component';
import { EmptyComponent } from './Components/empty/empty.component';

const routes: Routes = [
  {path: '', component : ImagesListComponent },
  {path: 'registeration', component : RegisterationComponent },
  {path : "empty", component : EmptyComponent},
  {path: '**', component :  ErrorHandlingComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
