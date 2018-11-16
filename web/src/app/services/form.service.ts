import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";
import {FirebaseListObservable} from "angularfire2/database-deprecated";

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private angularFireDataBase: AngularFireDatabase) {
  }

  get() {
    return this.angularFireDataBase.list('forms/');
  }

  get2(offset = 20, startKey = '1542151974732') {
    return this.angularFireDataBase.database.ref().child('forms/').orderByKey().startAt(startKey).limitToFirst(offset + 1);
  }

  getPaged2() {
    return this.angularFireDataBase.list('forms/');
  }

  getPaged(offset = 20, startKey?) {
    startKey = (startKey) ? startKey.toString() : '1542151974732';
    return this.angularFireDataBase.database.ref().child('forms/').orderByKey().startAt(startKey.toString()).limitToFirst(offset + 1);
  }

  getForSupervisor(supervisor) {
    return this.angularFireDataBase.database.ref().child('forms/').orderByChild('user/uid').equalTo(supervisor);
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

  search(queryType, searchQuery) {
    return this.angularFireDataBase.database.ref().child('forms')
      .orderByChild(queryType)
      .startAt(searchQuery)
      .endAt(searchQuery + "\uf8ff")
      .once("value", (snapshot) => snapshot.val());
  }
}
