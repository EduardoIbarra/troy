import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireStorage} from "angularfire2/storage";

@Injectable()
export class MedidorProvider {

  constructor(private angularFireDataBase: AngularFireDatabase, private angularFireStorage: AngularFireStorage) {
  }
  get() {
    return this.angularFireDataBase.list('medidores/');
  }
  getById(uid) {
    return this.angularFireDataBase.object('medidores/' + uid);
  }
  add(user) {
    return this.angularFireDataBase.object('/medidores/' + user.uid).set(user);
  }
  edit(user) {
    return this.angularFireDataBase.object('/medidores/' + user.uid).set(user);
  }

}
