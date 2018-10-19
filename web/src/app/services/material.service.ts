import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  constructor(private angularFireDataBase: AngularFireDatabase) {
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
