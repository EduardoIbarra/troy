import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FallidaPage} from "./fallida/fallida";
import {FallidaProvider} from "../../providers/fallida/fallida";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {UserProvider} from "../../providers/user/user";
import {VisitsPage} from "../visits/visits";

@IonicPage()
@Component({
  selector: 'page-fallidas',
  templateUrl: 'fallidas.html',
})
export class FallidasPage {
  user: any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public fallidaProvider: FallidaProvider,
              private authenticationProvider: AuthenticationProvider,
              private userProvider: UserProvider) {
    this.authenticationProvider.getStatus().subscribe((data) => {
      if (!data) {
        return;
      }
      this.userProvider.getById(data.uid).valueChanges().subscribe((data) => {
        this.user = data;
        if(this.user.fallidas) {
          this.user.fallidas = Object.keys(this.user.fallidas).map(key => this.user.fallidas[key]);
          this.user.fallidas.forEach((f) => {
            f.visitas = Object.keys(f.visitas).map(key => f.visitas[key]);
          });
        }
        console.log(this.user);
      }, (error) => {
        console.log(error);
      });
    }, (error) => {
      console.log(error);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FallidasPage');
  }
  openFallidas(form) {
    this.navCtrl.push(FallidaPage, {form: form});
  }
  openVisits(f) {
    this.navCtrl.push(VisitsPage, {form: f});
  }
}
