import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";

@Injectable()
export class FormProvider {

  constructor(private angularFireDataBase: AngularFireDatabase) {
  }
  get() {
    return this.angularFireDataBase.list('forms/');
  }
  getById(uid) {
    return this.angularFireDataBase.object('forms/' + uid);
  }
  getSerieById(uid) {
    return this.angularFireDataBase.object('series/' + uid);
  }
  getByUser(uid) {
    return this.angularFireDataBase.list('forms').query.orderByChild('user/uid').equalTo(uid);
  }
  add(form) {
    return this.angularFireDataBase.object('/forms/' + form.uid).set(form);
  }
  edit(form) {
    return this.angularFireDataBase.object('/forms/' + form.uid).set(form);
  }

}
