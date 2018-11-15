import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {SignaturePad} from "angular2-signaturepad/signature-pad";
import {MedidorProvider} from "../../../providers/medidor/medidor";
import {FallidaProvider} from "../../../providers/fallida/fallida";
import {FallidasPage} from "../fallidas";
import {AuthenticationProvider} from "../../../providers/authentication/authentication";
import {UserProvider} from "../../../providers/user/user";
import {Storage} from "@ionic/storage";
import {GeneralProvider} from "../../../providers/general/general";
import {Camera, CameraOptions} from "@ionic-native/camera";

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
  firmaCFE:string;
  firmaTroy:string;
  pictures: any[] = [];
  reasons: any = [
    'Predio abandonado',
    'Cliente agresivo',
    'Uso ilícito',
    'No convencido',
    'Ausente',
    'Otra'
  ];
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private medidorProvider: MedidorProvider,
              private toastController: ToastController,
              public fallidaProvider: FallidaProvider,
              public authenticationProvider: AuthenticationProvider,
              public userProvider: UserProvider,
              private loadingCtrl: LoadingController,
              private camera: Camera,
              private storage: Storage,
              private generalProvider: GeneralProvider) {
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
  getFirmaTroy() {
    this.firmaTroy = JSON.parse(JSON.stringify(this.signaturePad.toDataURL()));
    this.drawClear();
  }
  getFirmaCFE() {
    this.firmaCFE = JSON.parse(JSON.stringify(this.signaturePad.toDataURL()));
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
  uploadPictures(fallida) {
    if (this.firmaCFE) {
      const firmaCFEId = Date.now();
      this.generalProvider.uploadPicture('firmas/cfe/' + firmaCFEId + '.jpg', this.firmaCFE).then(() => {
        this.generalProvider.getDownloadURL('firmas/cfe/' + firmaCFEId + '.jpg').subscribe((url) => {
          this.generalProvider.freeUpdate('/fallidas/' + fallida.medidor + '/visitas/' + fallida.timestamp + '/firmaCFE', url);
        });
      }).catch(() => {
        console.log('Falla al subir la FirmaCFE');
      });
    }
    if (this.firmaTroy) {
      const firmaTroyId = Date.now();
      this.generalProvider.uploadPicture('firmas/troy/' + firmaTroyId + '.jpg', this.firmaTroy).then(() => {
        this.generalProvider.getDownloadURL('firmas/troy/' + firmaTroyId + '.jpg').subscribe((url) => {
          this.generalProvider.freeUpdate('/fallidas/' + fallida.medidor + '/visitas/' + fallida.timestamp + '/firmaTroy', url);
        });
      }).catch(() => {
        console.log('Falla al subir la FirmaTroy');
      });
    }
    if (this.pictures && this.pictures.length > 0) {
      this.pictures.forEach((picture) => {
        const thisPictureId = Date.now();
        this.generalProvider.uploadPicture('instalaciones/' + thisPictureId + '.jpg', picture).then(() => {
          this.generalProvider.getDownloadURL('instalaciones/' + thisPictureId + '.jpg').subscribe((url) => {
            this.generalProvider.freeUpdate('/fallidas/' + fallida.medidor + '/visitas/' + fallida.timestamp + '/pictures/' + thisPictureId, url);
          });
        }).catch(() => {
          console.log('Falla al subir fotografía');
        });
      })
    }
  }
  save() {
    if (this.fallida.reason && this.fallida.reason === 'Otra' && !this.fallida.observaciones) {
      alert('Debe ingresar observaciones para continuar');
      return;
    }
    let fallida = this.fallidaProvider.getById(this.fallida.medidor).valueChanges().subscribe((data: any) => {
      fallida.unsubscribe();
      if (data) {
        data.visitas = Object.keys(data.visitas);
      }
      if (data && data.visitas && data.visitas.length >= 3) {
        alert('Este medidor ya tiene registradas 3 o más visitas fallidas');
      } else {
        this.fallida.timestamp = (this.fallida.timestamp) ? this.fallida.timestamp : Date.now();
        const user = {uid: this.user.uid, name: this.user.name, last_name: this.user.last_name};
        console.log(this.fallida);
        this.fallidaProvider.add(this.fallida, user).then((data) => {
          const toast = this.toastController.create({
            message: 'Información enviada con éxito', duration: 4000, position: 'bottom'
          });
          this.uploadPictures(this.fallida);
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
    }, (e) => {
      alert('Ocurrió un error al verificar el medidor o no está conectado a internet');
      console.log(e);
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
  async takePicture(source) {
    try {
      let cameraOptions: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        allowEdit: true,
        saveToPhotoAlbum: true
      };
      cameraOptions.sourceType = (source == 'camera') ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY;
      const result = await this.camera.getPicture(cameraOptions);
      const image = `data:image/jpeg;base64,${result}`;
      console.log(image);
      this.pictures.push(image);
    } catch (e) {
      console.error(e);
    }
  }
}
