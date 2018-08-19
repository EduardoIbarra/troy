import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {FormInstallationPage} from "../form-installation/form-installation";
import {FormProvider} from "../../providers/form/form";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {UserProvider} from "../../providers/user/user";
import {Storage} from "@ionic/storage";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  forms: any[] = [];
  user: any;
  offline_forms: any[];
  constructor(public navCtrl: NavController, private formProvider: FormProvider, private authenticationProvider: AuthenticationProvider, private userProvider: UserProvider, private storage: Storage) {
    this.authenticationProvider.getStatus().subscribe((data) => {
      this.userProvider.getById(data.uid).valueChanges().subscribe((data) => {
        this.user = data;
        if(this.user.forms) {
          this.user.forms = Object.keys(this.user.forms).map(key => this.user.forms[key]);
        }
        console.log(this.user);
      }, (error) => {
        console.log(error);
      });
    }, (error) => {
      console.log(error);
    });
  }
  openInstallation(form) {
    this.navCtrl.push(FormInstallationPage, {form: form});
  }
  openInstallationSent(form_id) {
    this.navCtrl.push(FormInstallationPage, {form_id: form_id});
  }
  ionViewWillEnter() {
    this.storage.get('offline_forms').then((data) => {
      this.offline_forms = JSON.parse(data);
    }).catch((error) => {
      console.log(error);
    });
  }
}

