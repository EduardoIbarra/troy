import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";

@Injectable({
  providedIn: 'root'
})
export class MedidorService {

  constructor(private angularFireDataBase: AngularFireDatabase) {
  }
  get() {
    return this.angularFireDataBase.list('medidores/nest2/');
  }
  getById(uid) {
    return this.angularFireDataBase.object('medidores/nest2/' + uid);
  }
  add(medidor) {
    return this.angularFireDataBase.object('/medidores/nest2/' + medidor.uid).set(medidor);
  }
  edit(medidor) {
    return this.angularFireDataBase.object('/medidores/nest2/' + medidor.uid).set(medidor);
  }
  delete(medidor) {
    return this.angularFireDataBase.object('/medidores/nest2/' + medidor.uid).remove();
  }
}
