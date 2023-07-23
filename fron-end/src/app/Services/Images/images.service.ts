import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environemnts } from 'src/environments/environments';
import { ImageRequest } from 'src/app/Models/ImageUploadRequest';
import { ImageDeleteRequest } from 'src/app/Models/ImageDeleteRequest';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(private httpClient : HttpClient) { }

  uploadImageData (imageRequest: ImageRequest) : Observable<any> {
    return this.httpClient.post<any>(environemnts.baseUrl + "/images/upload" , imageRequest);
  }

  getImagesData(uid : string) : Observable<ImageData []> {
    return this.httpClient.get<ImageData []>(environemnts.baseUrl + "/images/get-images", {
       params : {uid : uid} 
  })}

  deleteImage(imageDeleteRequest: ImageDeleteRequest) :Observable<any> {
    return this.httpClient.delete(environemnts.baseUrl + "/images/delete", {body : imageDeleteRequest});
  }
  
}
