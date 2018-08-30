import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FallidaPage} from "./fallida/fallida";

/**
 * Generated class for the FallidasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fallidas',
  templateUrl: 'fallidas.html',
})
export class FallidasPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FallidasPage');
  }
  openFallidas(form) {
    this.navCtrl.push(FallidaPage, {form: form});
  }
}
