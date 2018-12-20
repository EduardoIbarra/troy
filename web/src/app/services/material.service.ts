import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  constructor(private angularFireDataBase: AngularFireDatabase) {
  }

  get() {
    return this.angularFireDataBase.list('materiales/');
  }

  getById(uid) {
    return this.angularFireDataBase.object('materiales/' + uid);
  }

  add(user) {
    return this.angularFireDataBase.object('/materiales/' + user.uid).set(user);
  }

  edit(user) {
    return this.angularFireDataBase.object('/materiales/' + user.uid).set(user);
  }

  totals() {
    return this.angularFireDataBase.list('totals/materials');
  }

  totalBySubcontratista(subcontratistaId) {
    return this.angularFireDataBase.list(`totals/materials_subcontratista/${subcontratistaId}`);
  }

  totalBySubcontratistaMat(subcontratistaId, matId) {
    return this.angularFireDataBase.object(`totals/materials_subcontratista/${subcontratistaId}/${matId}`);
  }

  settotalBySubcontratistaMat(subcontratistaId, matId, value) {
    return this.angularFireDataBase.object(`totals/materials_subcontratista/${subcontratistaId}/${matId}`).set(value);
  }

  totalsSubcontratista() {
    return this.angularFireDataBase.list('totals/materials_subcontratista/');
  }
}
