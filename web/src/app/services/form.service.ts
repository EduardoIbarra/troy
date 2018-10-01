import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private angularFireDataBase: AngularFireDatabase) {
  }
  get() {
    return this.angularFireDataBase.list('forms/');
  }
  getById(uid) {
    return this.angularFireDataBase.object('forms/' + uid);
  }
  add(form) {
    return this.angularFireDataBase.object('/forms/' + form.uid).set(form);
  }
  edit(form) {
    return this.angularFireDataBase.object('/forms/' + form.uid).set(form);
  }
  delete(form) {
    return this.angularFireDataBase.object('/forms/' + form).remove();
  }
  deleteforUser(user, form) {
    return this.angularFireDataBase.object('/users/' + user + '/forms/' + form).remove();
  }
  getSerieById(uid) {
    return this.angularFireDataBase.object('series/' + uid);
  }
  getMedidorById(uid) {
    return this.angularFireDataBase.object('medidores_usados/' + uid);
  }
}
