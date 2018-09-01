import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FallidaPage} from "./fallida/fallida";
import {FallidaProvider} from "../../providers/fallida/fallida";

@IonicPage()
@Component({
  selector: 'page-fallidas',
  templateUrl: 'fallidas.html',
})
export class FallidasPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public fallidaProvider: FallidaProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FallidasPage');
  }
  openFallidas(form) {
    this.navCtrl.push(FallidaPage, {form: form});
  }
}
