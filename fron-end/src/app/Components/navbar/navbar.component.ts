import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {Store} from '@ngrx/store';

import { handleAddPhoto } from 'src/state-management/navbar-state/navbar.actions';
import { login } from 'src/state-management/login-state/login-actions';
import { searchForLabels } from 'src/state-management/searching-labels-state/searching-labels.actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent {

  uid : string | null = "";

  constructor(private store: Store<{loginData : string, searchingForLabels : string}>, private router: Router) {
    this.store.select("loginData").subscribe({
      next : (value) => {
        this.uid = value;
        localStorage.setItem("uid", value);
      },
      error : (_) => {
        this.uid = "";
        localStorage.clear();
        this.store.dispatch(login({uid : ""}));
      }
    })
  }

  handleAddPhoto(){
    this.store.dispatch(handleAddPhoto());
    console.log(this.uid);
    
  }

  navigateToRegisteration(){
    this.router.navigate(['/registeration']);
  }

  logout(){
    localStorage.clear();
    this.store.dispatch(login({uid : ""}));
    this.router.navigate(['/']);
  }

  searchingForLabels($event: any){
    this.store.dispatch(searchForLabels({searchText : $event.target.value}));
  }
}