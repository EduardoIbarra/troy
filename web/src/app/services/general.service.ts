import { Injectable } from '@angular/core';
import {AngularFireStorage} from "angularfire2/storage";
import {AngularFireDatabase} from "angularfire2/database";

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private angularFireStorage: AngularFireStorage,
              private angularFireDataBase: AngularFireDatabase) {
    console.log('Hello GeneralProvider Provider');
  }
  uploadPicture(picture_name, image) {
    return this.angularFireStorage.ref('pictures/' + picture_name).putString(image, 'data_url');
  }
  getDownloadURL(picture_name) {
    return this.angularFireStorage.ref('pictures/' + picture_name).getDownloadURL();
  }
  freeUpdate(path, value) {
    return this.angularFireDataBase.object(path).set(value);
  }
}
