import { Component } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import { Observable } from 'rxjs';

import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { handleAddPhoto } from 'src/state-management/navbar-state/navbar.actions';

import { RegisterationService } from 'src/app/Services/registeration/registeration.service';
import { ImagesService } from 'src/app/Services/Images/images.service';

import { ImageRequest } from 'src/app/Models/ImageUploadRequest';

@Component({
  selector: 'app-new-image-modal',
  templateUrl: './new-image-modal.component.html',
  styleUrls: ['./new-image-modal.component.scss']
})

export class NewImageModalComponent {

  newPhotoForm : any;
  imageUrlError: string = "";
  openModal$  : Observable<boolean>;
  loading : boolean = false;
  imageUploadSuccess : string = "";
  imagePlaceholder : string = "https://images.unsplash.com/photo-1683130461728-cf2ab05765c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=400&q=60";

  constructor(private formBuilder: FormBuilder, private store : Store<{hanldeAddPhoto : boolean}>,private registeration: RegisterationService, private imagesService: ImagesService, private router: Router){
    this.openModal$ = store.select('hanldeAddPhoto');

    this.newPhotoForm = this.formBuilder.group({
      label : ['' , [Validators.required, Validators.minLength(4)] ],
      imageUrl : ['', Validators.required]
    });
  }

  get label() {
    return this.newPhotoForm.get('label');
  }

  get imageUrl(){
    return this.newPhotoForm.get('imageUrl');
  }

  handleAddImageModal() {
    this.store.dispatch(handleAddPhoto());
    this.imageUploadSuccess = "";
    this.newPhotoForm.reset("");
  }

  uploadImage(){
    if(this.checkIsImage(this.imageUrl.value)){
      const imageUploadRequest : ImageRequest = {
        imageUrl : this.imageUrl.value,
        label : this.label.value,
        uid : localStorage.getItem("uid"),
      }
      this.loading = true;
      //Uploading the image process if the Url is valid :
      this.imagesService.uploadImageData(imageUploadRequest).subscribe({
        error : (error) => {
          this.imageUrlError = "There was a problem uploading the image...";
          this.loading = false;
        },
        complete : () => {
          this.imageUrlError = "";
          this.loading = false;
          this.imageUploadSuccess = "Uploaded Successfully";
          this.handleAddImageModal();
          this.router.navigateByUrl('/empty', { skipLocationChange: true }).then(() =>  this.router.navigate(['/']));
        }
      })
    } 
    else {
      //handle wrong image URL :
      this.imageUrlError = "Invalid Url , please enter a valid one";
      return;
    }   
  }

  checkIsImage(imageUrl :string){
    let img = new Image();
    img.src = imageUrl;
    console.log(imageUrl);
    if(img.naturalWidth > 0)
    {
      this.imageUrlError = "";
      return true;

    }
    else{
      return false;
    }

  }

  
}