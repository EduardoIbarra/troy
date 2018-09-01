import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";

@Injectable()
export class FallidaProvider {

  constructor(private angularFireDataBase: AngularFireDatabase) {
  }
  get() {
    return this.angularFireDataBase.list('fallidas/');
  }
  getById(medidor) {
    return this.angularFireDataBase.object('fallidas/' + medidor);
  }
  getSerieById(medidor) {
    return this.angularFireDataBase.object('series/' + medidor);
  }
  getByUser(medidor) {
    return this.angularFireDataBase.list('fallidas').query.orderByChild('user/uid').equalTo(medidor);
  }
  add(fallida, user) {
    this.angularFireDataBase.object('/fallidas/' + fallida.medidor + '/user/').set(user);
    return this.angularFireDataBase.object('/fallidas/' + fallida.medidor + '/visitas/' + fallida.timestamp).set(fallida);
  }
  edit(fallida) {
    return this.angularFireDataBase.object('/fallidas/' + fallida.medidor + '/visitas/' + fallida.timestamp).set(fallida);
  }
}
