import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";

@Injectable({
  providedIn: 'root'
})
export class SubcontratistaService {

  constructor(private angularFireDataBase: AngularFireDatabase) {
  }
  get() {
    return this.angularFireDataBase.list('subcontratistas/');
  }
  getById(id) {
    return this.angularFireDataBase.object('subcontratistas/' + id);
  }
  add(subcontratista) {
    return this.angularFireDataBase.object('/subcontratistas/' + subcontratista.id).set(subcontratista);
  }
  edit(subcontratista) {
    return this.angularFireDataBase.object('/subcontratistas/' + subcontratista.id).set(subcontratista);
  }
  delete(subcontratista) {
    return this.angularFireDataBase.object('/subcontratistas/' + subcontratista.id).remove();
  }
}
