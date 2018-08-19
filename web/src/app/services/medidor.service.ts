import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";

@Injectable({
  providedIn: 'root'
})
export class MedidorService {

  constructor(private angularFireDataBase: AngularFireDatabase) {
  }
  get() {
    return this.angularFireDataBase.list('medidores/');
  }
  getById(uid) {
    return this.angularFireDataBase.object('medidores/' + uid);
  }
  add(medidor) {
    return this.angularFireDataBase.object('/medidores/' + medidor.uid).set(medidor);
  }
  edit(medidor) {
    return this.angularFireDataBase.object('/medidores/' + medidor.uid).set(medidor);
  }
  delete(medidor) {
    return this.angularFireDataBase.object('/medidores/' + medidor.uid).remove();
  }
}
