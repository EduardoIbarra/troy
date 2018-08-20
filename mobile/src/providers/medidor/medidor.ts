import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireStorage} from "angularfire2/storage";

@Injectable()
export class MedidorProvider {

  constructor(private angularFireDataBase: AngularFireDatabase, private angularFireStorage: AngularFireStorage) {
  }
  get() {
    return this.angularFireDataBase.list('medidores/nest2/');
  }
  getById(uid) {
    return this.angularFireDataBase.object('medidores/nest2/' + uid);
  }
  add(user) {
    return this.angularFireDataBase.object('/medidores/nest2/' + user.uid).set(user);
  }
  edit(user) {
    return this.angularFireDataBase.object('/medidores/nest2/' + user.uid).set(user);
  }

}
