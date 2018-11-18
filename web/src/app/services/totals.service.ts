import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireStorage} from "angularfire2/storage";

@Injectable({
  providedIn: 'root'
})
export class TotalsService {

  constructor(private angularFireDataBase: AngularFireDatabase) {
  }
  getTotals() {
    return this.angularFireDataBase.list('totals/');
  }
}
