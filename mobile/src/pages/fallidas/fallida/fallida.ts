import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {SignaturePad} from "angular2-signaturepad/signature-pad";
import {MedidorProvider} from "../../../providers/medidor/medidor";
import {FallidaProvider} from "../../../providers/fallida/fallida";
import {FallidasPage} from "../fallidas";
import {AuthenticationProvider} from "../../../providers/authentication/authentication";
import {UserProvider} from "../../../providers/user/user";

@IonicPage()
@Component({
  selector: 'page-fallida',
  templateUrl: 'fallida.html',
})
export class FallidaPage {
  fallida: any = {};
  public signaturePadOptions : Object = {
    'minWidth': 2,
    'canvasWidth': 340,
    'canvasHeight': 200
  };
  @ViewChild(SignaturePad) public signaturePad : SignaturePad;
  today: any = Date.now();
  user: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private medidorProvider: MedidorProvider,
              private toastController: ToastController,
              public fallidaProvider: FallidaProvider,
              public authenticationProvider: AuthenticationProvider,
              public userProvider: UserProvider) {
    this.authenticationProvider.getStatus().subscribe((data) => {
      this.userProvider.getById(data.uid).valueChanges().subscribe((data2) => {
        this.user = data2;
      }, (error) => {
        console.log(error);
      });
    }, (error) => {
      console.log(error);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FallidaPage');
    window.setTimeout(() => {
      this.signaturePad.clear();
      this.canvasResize();
    }, 800);
  }
  drawClear() {
    this.signaturePad.clear();
  }
  firmaContratista() {
    this.fallida.firmaContratista = JSON.parse(JSON.stringify(this.signaturePad.toDataURL()));
    this.drawClear();
  }
  firmaCFE() {
    this.fallida.firmaCFE = JSON.parse(JSON.stringify(this.signaturePad.toDataURL()));
    this.drawClear();
  }
  searchMedidor() {
    this.medidorProvider.getById(this.fallida.medidor).valueChanges().subscribe((data: any) => {
      if(data) {
        this.fallida.nombre = data.nombre;
        this.fallida.calle = data.Direccion;
        this.fallida.colonia = data.colonia;
        this.fallida.ciudad = data.municipio + ', ' + data.estado;
        this.fallida.rpu = data.rpu;
        console.log(data);
      }else {
        const toast = this.toastController.create({message: 'Medidor no encontrado', duration: 4000, position: 'bottom'});
        toast.present();
      }
    }, (error) => {
      console.log(error);
    });
  }
  canvasResize() {
    let canvas = document.querySelector('canvas');
    this.signaturePad.set('minWidth', 1);
    this.signaturePad.set('canvasWidth', canvas.offsetWidth);
    this.signaturePad.set('canvasHeight', canvas.offsetHeight);
  }
  save() {
    this.fallida.timestamp = Date.now();
    this.fallidaProvider.add(this.fallida, this.user).then((data) => {
      const toast = this.toastController.create({
          message: 'Información enviada con éxito', duration: 4000, position: 'bottom'
        });
      toast.present();
      this.fallida = {};
      this.navCtrl.setRoot(FallidasPage);
    }).catch((error) => {
      alert('Ocurrió un error al enviar la información');
      console.log(error);
    });
  }
}
