import { Injectable } from '@angular/core';
import {AngularFireStorage} from "angularfire2/storage";
import {AngularFireDatabase} from "angularfire2/database";

/*
  Generated class for the GeneralProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GeneralProvider {

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
