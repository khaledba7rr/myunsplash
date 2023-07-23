import { Component } from '@angular/core';
import {Store} from '@ngrx/store';
import { login } from 'src/state-management/login-state/login-actions';
import { handleAddPhoto } from 'src/state-management/navbar-state/navbar.actions';

import { ImagesService } from 'src/app/Services/Images/images.service';
import { RegisterationService } from 'src/app/Services/registeration/registeration.service';


import { ImageDeleteRequest } from 'src/app/Models/ImageDeleteRequest';
import { UserLogin } from 'src/app/Models/UserLogin';
import { ImageData } from 'src/app/Models/ImageData';

@Component({
  selector: 'app-images-list',
  templateUrl: './images-list.component.html',
  styleUrls: ['./images-list.component.scss']
})
export class ImagesListComponent {
  
  dummyImgArray : ImageData [] = [
    {
      label : 'Photo Lable',
      imageUrl : 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=600',
      imageGuid : ""
    },
    {
      label : 'Photo Lable',
      imageUrl : 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80',
      imageGuid : ""
    },
    {
      label : 'Photo Lable',
      imageUrl : 'https://1.bp.blogspot.com/-kK7Fxm7U9o0/YN0bSIwSLvI/AAAAAAAACFk/aF4EI7XU_ashruTzTIpifBfNzb4thUivACLcBGAsYHQ/s1280/222.jpg',
      imageGuid : ""
    },
    {
      label : 'Photo Lable',
      imageUrl : 'https://images.pexels.com/photos/1226302/pexels-photo-1226302.jpeg?auto=compress&cs=tinysrgb&w=600',
      imageGuid : ""
    },
    {
      label : 'Photo Lable',
      imageUrl : 'https://media.istockphoto.com/id/517188688/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=A63koPKaCyIwQWOTFBRWXj_PwCrR4cEoOw2S9Q7yVl8=',
      imageGuid : ""
    },
    {
      label : 'Photo Lable',
      imageUrl : 'https://media.istockphoto.com/id/1322277517/photo/wild-grass-in-the-mountains-at-sunset.jpg?s=612x612&w=0&k=20&c=6mItwwFFGqKNKEAzv0mv6TaxhLN3zSE43bWmFN--J5w=',
      imageGuid : ""
    },
    {
      label : 'Photo Lable',
      imageUrl : 'https://images.ctfassets.net/hrltx12pl8hq/7JnR6tVVwDyUM8Cbci3GtJ/bf74366cff2ba271471725d0b0ef418c/shutterstock_376532611-og.jpg',
      imageGuid : ""
    },
    {
      label : 'Photo Lable',
      imageUrl : 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D&w=1000&q=80',
      imageGuid : ""
    },
  ];

  databaseImgArray : any [] = [];
  
  filteredByLabelArray : ImageData [] = [];

  uid: string | null = "";

  filteringText : string = "";

  loading : boolean = false;

  openDeleteModal : boolean = false;

  password: string = "";

  deleteImageGuid = "";

  loginError : string = "";

  deletedText : string = "";

  constructor(private store : Store<{loginData : string, searchingForLabels : string}>, private imagesService : ImagesService, private registerationService : RegisterationService) {

    this.store.select("loginData").subscribe({
      next : (value) => {
        this.uid = value;
        localStorage.setItem("uid", value);
        this.fetchingImages();
      },
      error : (_) => {
        this.uid = "";
        localStorage.clear();
        this.store.dispatch(login({uid : ""}));
      }
    });

    this.store.select("searchingForLabels").subscribe({
      next : (value) => {
        this.filteringText = value;
        this.filteringImagesByLabel(value);
      }
    });
  }

  handleAddPhoto(){
    this.store.dispatch(handleAddPhoto());
  }

  fetchingImages() {

    this.loading = true;
    this.imagesService.getImagesData(localStorage.getItem("uid") ?? "").subscribe({
      next : (response) => {
        this.databaseImgArray = Object?.values(response).reverse();
      },
      error : (error) => {
        console.error(error);
        this.loading = false;
      },
      complete : () => {
        this.loading = false;
      }
    })
    
  }

  imagesArray(){
    if(this.uid){
      return this.filteringText ? this.filteredByLabelArray : this.databaseImgArray;
    }else{
      return this.dummyImgArray;
    }
  }

  handleDeleteModal(imageGuid: string){
    this.deleteImageGuid = imageGuid;
    this.openDeleteModal = !this.openDeleteModal;
    this.password = "";
    this.loginError = "";
    this.deletedText = "";
  }

  deleteImage() {
    if(this.password.length < 6){
      this.loginError = "Password must be at least 6 chars";
      return;
    }
      
      const imageDeleteRequest : ImageDeleteRequest = 
      {
        imageGuid : this.deleteImageGuid,
        userId : this.uid,
      }
  
      const userLogin : UserLogin = {
        email : localStorage.getItem("email"),
        password : this.password
      }
  
      this.registerationService.loginUser(userLogin).subscribe({
        error : (_) => {
          this.loginError = "Wrong password !";
        },
        complete: () => {
          this.loginError = "";
          this.imagesService.deleteImage(imageDeleteRequest).subscribe({
            next : (resp) => {
            },
            error : (_) => {
              this.loginError = "error deleteing the image";
            },
            complete : () => {
              console.log(imageDeleteRequest);
              this.filteringText = "";
              this.loginError = "";
              this.deletedText = "Success !";
              this.handleDeleteModal("");
              this.fetchingImages();
            }
          })
        }
      })

  }

  filteringImagesByLabel(filteringValue : string) {
    if(this.databaseImgArray.length > 1){
      this.filteredByLabelArray = this.databaseImgArray.filter( imageData => imageData.label.toLowerCase().includes(filteringValue.toLowerCase()));
    }
  }

}
