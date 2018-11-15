import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireStorage} from "angularfire2/storage";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private angularFireDataBase: AngularFireDatabase, private angularFireStorage: AngularFireStorage) {
  }
  get() {
    return this.angularFireDataBase.list('users/');
  }
  getById(uid) {
    return this.angularFireDataBase.object('users/' + uid);
  }
  add(user) {
    return this.angularFireDataBase.object('/users/' + user.uid).set(user);
  }
  edit(user) {
    return this.angularFireDataBase.object('/users/' + user.uid).set(user);
  }
  uploadPicture(picture_name, image) {
    return this.angularFireStorage.ref('pictures/' + picture_name).putString(image, 'data_url');
  }
  getDownloadURL(picture_name) {
    return this.angularFireStorage.ref('pictures/' + picture_name).getDownloadURL();
  }
  delete(user) {
    return this.angularFireDataBase.object('/users/' + user.uid).remove();
  }
  getBySupervisor(supervisor) {
    return this.angularFireDataBase.database.ref().child('users/').orderByChild('supervisor').equalTo(supervisor);
  }
  getSubcontratistas() {
    return this.angularFireDataBase.list('subcontratistas/');
  }
  getSupervisors() {
    return this.angularFireDataBase.database.ref().child('users/').orderByChild('is_supervisor').equalTo('si');
  }
  getSupervisors2() {
    return this.angularFireDataBase.database.ref().child('users/').orderByChild('is_supervisor').equalTo('si');
  }
}
