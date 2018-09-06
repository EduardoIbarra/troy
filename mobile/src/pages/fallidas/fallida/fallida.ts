import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {SignaturePad} from "angular2-signaturepad/signature-pad";
import {MedidorProvider} from "../../../providers/medidor/medidor";
import {FallidaProvider} from "../../../providers/fallida/fallida";
import {FallidasPage} from "../fallidas";
import {AuthenticationProvider} from "../../../providers/authentication/authentication";
import {UserProvider} from "../../../providers/user/user";
import {Storage} from "@ionic/storage";

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
  showing = false;
  offline_fallidas:any [] = [];
  isOffline = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private medidorProvider: MedidorProvider,
              private toastController: ToastController,
              public fallidaProvider: FallidaProvider,
              public authenticationProvider: AuthenticationProvider,
              public userProvider: UserProvider,
              private loadingCtrl: LoadingController,
              private storage: Storage) {
    this.authenticationProvider.getStatus().subscribe((data) => {
      this.userProvider.getById(data.uid).valueChanges().subscribe((data2) => {
        this.user = data2;
      }, (error) => {
        console.log(error);
      });
    }, (error) => {
      console.log(error);
    });
    if (this.navParams.get('visit')) {
      this.fallida = this.navParams.get('visit');
      console.log(this.fallida);
      this.showing = true;
    }
    if (this.navParams.get('offline')) {
      this.isOffline = this.navParams.get('offline');
    }
  }
  ionViewWillEnter() {
    this.storage.get('offline_fallidas').then((data) => {
      this.offline_fallidas = JSON.parse(data || '[]');
    }).catch((error) => {
      console.log(error);
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad FallidaPage');
    window.setTimeout(() => {
      if (this.showing) {
        return;
      }
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
    this.fallida.timestamp = (this.fallida.timestamp) ? this.fallida.timestamp : Date.now();
    this.fallidaProvider.add(this.fallida, this.user).then((data) => {
      const toast = this.toastController.create({
          message: 'Información enviada con éxito', duration: 4000, position: 'bottom'
        });
      toast.present();
      if (this.isOffline) {
        if (this.offline_fallidas) {
          this.offline_fallidas.forEach((of, i) => {
            if (of.timestamp == this.fallida.timestamp) {
              this.offline_fallidas.splice(i, 1);
              this.storage.set('offline_fallidas', JSON.stringify(this.offline_fallidas)).then((data) => {
              }).catch((error) => {
                console.log(error);
              });
            }
          });
        }
      }
      this.fallida = {};
      this.navCtrl.setRoot(FallidasPage);
    }).catch((error) => {
      alert('Ocurrió un error al enviar la información');
      console.log(error);
    });
  }
  finishOffline() {
    let loading = this.loadingCtrl.create({
      content: 'Por favor espera mientras se envía el formulario...'
    });
    loading.present();
    this.fallida.timestamp = Date.now();
    this.fallida.guardado_offline = true;
    this.offline_fallidas.push(this.fallida);
    this.storage.set('offline_fallidas', JSON.stringify(this.offline_fallidas)).then((data) => {
      loading.dismiss();
      const toast = this.toastController.create({message: '¡Visita fallida guardada localmente con éxito!', duration: 5000, position: 'bottom'});
      toast.present();
      this.fallida = {};
      this.navCtrl.setRoot(FallidasPage);
    }).catch((error) => {
      alert('Ocurrió un error mientras se guardaba la visita fallida:  ' + JSON.stringify(error));
      loading.dismiss();
      console.log(error);
    });
  }
}
