import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireStorage} from "angularfire2/storage";

@Injectable()
export class MaterialProvider {

  constructor(private angularFireDataBase: AngularFireDatabase, private angularFireStorage: AngularFireStorage) {
  }
  get() {
    return this.angularFireDataBase.list('materiales/');
  }
  getById(uid) {
    return this.angularFireDataBase.object('materiales/' + uid);
  }
  add(user) {
    return this.angularFireDataBase.object('/materiales/' + user.uid).set(user);
  }
  edit(user) {
    return this.angularFireDataBase.object('/materiales/' + user.uid).set(user);
  }

}
