import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FallidaPage} from "../fallidas/fallida/fallida";

/**
 * Generated class for the VisitsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-visits',
  templateUrl: 'visits.html',
})
export class VisitsPage {
  form: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    if (this.navParams.get('form')) {
      this.form = this.navParams.get('form');
      console.log(this.form);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VisitsPage');
  }

  goToVisit(v) {
    this.navCtrl.push(FallidaPage, {'visit': v});
  }
}
