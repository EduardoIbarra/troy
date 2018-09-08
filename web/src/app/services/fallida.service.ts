import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";

@Injectable({
  providedIn: 'root'
})
export class FallidaService {

  constructor(private angularFireDataBase: AngularFireDatabase) {
  }
  get() {
    return this.angularFireDataBase.list('fallidas/');
  }
  getById(medidor) {
    return this.angularFireDataBase.object('fallidas/' + medidor);
  }
  add(fallida) {
    return this.angularFireDataBase.object('/fallidas/' + fallida.medidor).set(fallida);
  }
  edit(fallida) {
    return this.angularFireDataBase.object('/fallidas/' + fallida.medidor).set(fallida);
  }
  delete(fallida) {
    return this.angularFireDataBase.object('/fallidas/' + fallida.medidor).remove();
  }
}
