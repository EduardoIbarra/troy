import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireStorage} from "angularfire2/storage";

@Injectable()
export class UserProvider {

  constructor(private angularFireDataBase: AngularFireDatabase, private angularFireStorage: AngularFireStorage) {
  }
  get() {
    return this.angularFireDataBase.list('users/');
  }
  getSubcontratistas() {
    return this.angularFireDataBase.list('subcontratistas/');
  }
  getById(uid) {
    return this.angularFireDataBase.object('users/' + uid);
  }
  getBySupervisor(supervisor) {
    return this.angularFireDataBase.database.ref().child('users/').orderByChild('supervisor').equalTo(supervisor);
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
  addFriend(uid, friendId) {
    this.angularFireDataBase.object('users/' + uid + '/friends/' + friendId).set(friendId);
    return this.angularFireDataBase.object('users/' + friendId + '/friends/' + uid).set(uid);
  }

}
