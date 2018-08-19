import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import {HomePage} from "../home/home";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {UserProvider} from "../../providers/user/user";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  password: 'aoeaoe';
  password2: 'aoeaoe';
  email: 'aoe@aoe.aoe';
  name: 'Eduardo';
  operation: string = 'login';
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthenticationProvider, public userService: UserProvider, private toastCtrl: ToastController) {
    this.authService.getStatus().subscribe((data) => {
      if(data) {
        this.navCtrl.setRoot(HomePage);
      }
    }, (error) => {
      console.log(error);
    });
  }
  registerWithEmail() {
    if(this.password !== this.password2) {
      alert('Las contraseñas no coinciden');
      return;
    }
    this.authService.registerWithEmail(this.email, this.password).then((data) => {
      const user = {
        name: this.name,
        email: this.email,
        uid: data.user.uid,
        active: true
      };
      this.userService.add(user).then((data) => {
        let toast = this.toastCtrl.create({
          message: 'Usuario registrado con éxito',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
        this.operation = 'login';
        console.log(data);
      }).catch((error) => {
        alert('Ocurrió un error');
        console.log(error);
      });
    }).catch((error) => {
      console.log(error);
    });
  }
  loginWithEmail() {
    this.authService.loginWithEmail(this.email, this.password).then((data) => {
      console.log(data);
      let toast = this.toastCtrl.create({
        message: 'Bienvenido',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      this.navCtrl.setRoot(HomePage);
    }).catch((error) => {
      alert('Ocurrió un error');
      console.log(error);
    })
  }
  /*facebookAuth() {
    this.authService.facebookAuth().then((data) => {
      console.log(data);
      const user: User = {
        name: data.user.displayName,
        email: data.user.email,
        status: Status.Online,
        uid: data.user.uid,
        active: true
      };
      if(data.additionalUserInfo.isNewUser) {
        this.userService.add(user).then((data) => {
          let toast = this.toastCtrl.create({
            message: 'Conectado a Facebook con éxito',
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
          this.navCtrl.push(HomePage);
        }).catch((error) => {
          alert('Ocurrió un error');
          console.log(error);
        });
      }else {
        let toast = this.toastCtrl.create({
          message: 'Facebook Login Exitoso',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
        this.navCtrl.push(HomePage);
      }
    }).catch((error) => {
      alert('Ocurrió un error');
      console.log(error);
    })
  }*/
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  goToHome() {
    this.navCtrl.setRoot(HomePage);
  }
  backToHome() {
    this.navCtrl.pop();
  }

}
