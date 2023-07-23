import { Component } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import { RegisterationService } from 'src/app/Services/registeration/registeration.service';

import {Store} from '@ngrx/store';
import { Router } from '@angular/router';

import { UserRegisteration } from 'src/app/Models/UserRegisteration';
import { UserLogin } from 'src/app/Models/UserLogin';
import { login } from 'src/state-management/login-state/login-actions';

@Component({
  selector: 'app-registeration',
  templateUrl: './registeration.component.html',
  styleUrls: ['./registeration.component.scss']
})

export class RegisterationComponent {
  isSignUp: boolean = true;
  showPassword: boolean = false;
  registerationForm: any;
  authenticationError: String = '';
  authenticationSuccess: String = '';
  loading : boolean = false;

  constructor(formBuilder: FormBuilder, private registerationService : RegisterationService,private store : Store<{loginData : string}>, private router : Router) {

    this.registerationForm = formBuilder.group({
      fullName : ["" , [Validators.required, Validators.minLength(6)]],
      email : ["", [Validators.email, Validators.required]],
      password : ["" ,[Validators.required, Validators.minLength(6)]],
    })

  }

  handleShowPassword(){
    this.showPassword = !this.showPassword;
  }

  hanldeSignUp(){
    this.isSignUp = !this.isSignUp;
    this.authenticationError = '';
    this.authenticationSuccess = '';
  }

  signupOrLogin(){
    
    if(this.isSignUp){

      const user : UserRegisteration = {
        fullName : this.fullName.value,
        email : this.email.value,
        password : this.password.value,
      }

      this.loading = true;
      //register user :
      this.registerationService.registerNewUser(user).subscribe({
        next : (response) => {
          //save user data to database
          this.registerationService.saveUserData(user, response.localId).subscribe({
            next : (response) => console.log('saved !!!'),
            error : (error) => console.error(error),
            complete : () => console.log('successfully'),
          });
        },
        error : (response) => {
          this.loading = false;
          this.authenticationError = response.status === 0 ? response.statusText : response?.error?.error?.message;
        },
        complete : () => { 
          this.loading = false;
          this.authenticationSuccess = "You 've been registered successfully";
        }
      });
    }
    else{
      const user: UserLogin = 
      {
        email : this.email.value,
        password : this.password.value
      }
      this.loading = true;
      this.registerationService.loginUser(user).subscribe({
        next : (response) => {
          console.log(response);
          this.loading = false;
          this.store.dispatch(login({uid : response.localId}));
          localStorage.setItem("email",response.email);
          localStorage.setItem("uid", response.localId);
        },

        error : (response) => 
        {
          this.loading = false;
          this.authenticationError = response.status === 0 ? response.statusText : response?.error?.error?.message;
        },

        complete : () => {
          this.loading = false;
          this.router.navigate(['/']);
        }

      });
    }
    
  }

  get fullName(){
    return this.registerationForm.get('fullName');
  }

  get email(){
    return this.registerationForm.get('email');
  }

  get password(){
    return this.registerationForm.get('password'); 
  }

}
