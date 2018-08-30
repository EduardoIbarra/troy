import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {SignaturePad} from "angular2-signaturepad/signature-pad";
import {MedidorProvider} from "../../../providers/medidor/medidor";

/**
 * Generated class for the FallidaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fallida',
  templateUrl: 'fallida.html',
})
export class FallidaPage {
  form: any = {};
  public signaturePadOptions : Object = {
    'minWidth': 2,
    'canvasWidth': 340,
    'canvasHeight': 200
  };
  @ViewChild(SignaturePad) public signaturePad : SignaturePad;
  today: any = Date.now();
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private medidorProvider: MedidorProvider,
              private toastController: ToastController) {
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
    this.form.firmaContratista = JSON.parse(JSON.stringify(this.signaturePad.toDataURL()));
    this.drawClear();
  }
  firmaCFE() {
    this.form.firmaCFE = JSON.parse(JSON.stringify(this.signaturePad.toDataURL()));
    this.drawClear();
  }
  searchMedidor() {
    this.medidorProvider.getById(this.form.medidor).valueChanges().subscribe((data: any) => {
      if(data) {
        this.form.nombre = data.nombre;
        this.form.calle = data.Direccion;
        this.form.colonia = data.colonia;
        this.form.ciudad = data.municipio + ', ' + data.estado;
        this.form.rpu = data.rpu;
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
}
