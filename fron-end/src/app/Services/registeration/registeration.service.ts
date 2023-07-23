import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";

import { UserRegisteration } from '../../Models/UserRegisteration';
import { UserLogin } from '../../Models/UserLogin';
import { environemnts } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})

export class RegisterationService {

  constructor(private httpClient: HttpClient) { }

  registerNewUser(user: UserRegisteration) : Observable<any> {
    return this.httpClient.post<any>(environemnts.baseUrl + '/authentication/registeration', user);
  }

  saveUserData(user: UserRegisteration, userUid: string): Observable<any>{
    return this.httpClient.post<any>(environemnts.baseUrl + '/authentication/registeration/save-user-data', user, {
      params : {userUid : userUid,}
    });
  }

  loginUser(user : UserLogin): Observable<any>{
    return this.httpClient.post<any>(environemnts.baseUrl + '/authentication/login', user);
  }

}
