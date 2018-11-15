import { Component } from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
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
  constructor(public navCtrl: NavController, private formProvider: FormProvider, private authenticationProvider: AuthenticationProvider, private userProvider: UserProvider, private storage: Storage,
              public toastController: ToastController) {
    this.authenticationProvider.getStatus().subscribe((data) => {
      if (!data) {
        return;
      }
      const subscription = this.userProvider.getById(data.uid).valueChanges().subscribe((data) => {
        this.user = data;
        if(this.user.forms) {
          this.user.forms = Object.keys(this.user.forms).map(key => this.user.forms[key]);
        }
        subscription.unsubscribe();
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
  delete(f) {
    if (!confirm('Seguro que deseas eliminar este formulario? Ya no podrá ser enviado.')) {
      return;
    }
    this.offline_forms.forEach((of, i) => {
      if (of.uid == f.uid) {
        this.offline_forms.splice(i, 1);
      }
    });
    this.storage.set('offline_forms', JSON.stringify(this.offline_forms)).then((data) => {
      const toast = this.toastController.create({message: '¡Formulario eliminado con éxito!', duration: 4000, position: 'bottom'});
      toast.present();
    }).catch((error) => {
      console.log(error);
    });
  }
}

