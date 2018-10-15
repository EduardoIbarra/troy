import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams, ToastController} from 'ionic-angular';
import {Geolocation} from "@ionic-native/geolocation";
import {MaterialProvider} from "../../providers/material/material";
import {SignaturePad} from "angular2-signaturepad/signature-pad";
import {MedidorProvider} from "../../providers/medidor/medidor";
import {FormProvider} from "../../providers/form/form";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {UserProvider} from "../../providers/user/user";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {Storage} from '@ionic/storage';
import {QRScanner, QRScannerStatus} from "@ionic-native/qr-scanner";
import {ScanPage} from "../scan/scan";
import {GeneralProvider} from "../../providers/general/general";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";


/**
 * Generated class for the FormInstallationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;

@IonicPage()
@Component({
  selector: 'page-form-installation',
  templateUrl: 'form-installation.html',
})
export class FormInstallationPage {
  today = Date.now();
  step = 1;
  form: any = {};
  materials: any [] = [];
  current_materials: any [] = [];
  current_material: any;
  current_quantity: any;
  last_step = 5;
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  coords: any;
  pictures: any[] = [];
  user: any;
  @ViewChild(SignaturePad) public signaturePad: SignaturePad;
  public signaturePadOptions: Object = {
    'minWidth': 2,
    'canvasWidth': 340,
    'canvasHeight': 200
  };
  public signatureImage: string;
  offline_forms: any [] = [];
  showing = false;
  employees: any[] = [];
  firmaCFE: string;
  firmaTroy: string;
  supervisores: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private geolocation: Geolocation,
    private materialProvider: MaterialProvider,
    private medidorProvider: MedidorProvider,
    private toastController: ToastController,
    private formProvider: FormProvider,
    private loadingCtrl: LoadingController,
    private camera: Camera,
    private authService: AuthenticationProvider,
    private userProvider: UserProvider,
    private storage: Storage,
    private qrScanner: QRScanner,
    public modalController: ModalController,
    public barcodeScanner: BarcodeScanner,
    private generalProvider: GeneralProvider) {

    if (this.navParams.get('form')) {
      this.form = this.navParams.get('form');
      this.pictures = this.form.pictures;
      this.user = this.form.user;
      this.current_materials = this.form.current_materials;
      this.firmaCFE = this.form.firmaCFE;
      this.firmaTroy = this.form.firmaTroy;
      delete this.form.pictures;
      delete this.form.firmaCFE;
      delete this.form.firmaTroy;
      console.log(this.form);
    }
    if (this.navParams.get('form_id')) {
      this.showing = true;
      let loading = this.loadingCtrl.create({
        content: 'Por favor espera mientras se carga el formulario...'
      });
      loading.present();
      this.formProvider.getById(this.navParams.get('form_id')).valueChanges().subscribe((data) => {
        this.form = data;
        this.pictures = this.form.pictures;
        this.user = this.form.user;
        this.current_materials = this.form.current_materials;
        loading.dismiss();
      }, (error) => {
        console.log(error);
      });
    } else {
      this.showing = false;
    }
    this.storage.get('offline_forms').then((data) => {
      this.offline_forms = JSON.parse(data || '[]');
    }).catch((error) => {
      console.log(error);
    });
    /*this.geolocation.getCurrentPosition().then((resp) => {
      this.form.geolocation = {lat: resp.coords.latitude, lng: resp.coords.longitude};
      console.log(resp.coords);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.coords = data.coords;
      console.log(data.coords);
    });*/
    if (this.navParams.get('form')) {
      this.materials = this.form.current_materials;
    } else {
      this.materialProvider.get().valueChanges().subscribe((data) => {
        this.materials = data;
        this.materials.forEach((m) => {
          m.current_quantity = null;
        });
      }, (error) => {
        console.log(error);
      });
    }
    this.authService.getStatus().subscribe((data) => {
      if (!data) {
        return;
      }
      /*this.userProvider.getBySupervisor(data.uid).on('value', (data) => {
        console.log(data);
        data.forEach((data) => {
          this.employees.push(data.val());
        });
        console.log(this.employees);
      });*/
      this.userProvider.getById(data.uid).valueChanges().subscribe((data) => {
        this.user = data;
      }, (error) => {
        console.log(error);
      });
    }, (error) => {
      console.log(error);
    });
    this.userProvider.getSubcontratistas().valueChanges().subscribe((data) => {
      this.employees = data;
      console.log(this.employees);
    }, (error) => {
      console.log(error);
    });
    this.userProvider.getSupervisors().on('value', (data) => {
      this.supervisores = [];
      data.forEach((data) => {
        const supervisor = data.val();
        this.supervisores.push({
          name: supervisor.name,
          last_name: supervisor.last_name,
          uid: supervisor.uid,
          tipo: supervisor.tipo
        });
      });
      console.log(this.supervisores);
    });
  }

  canvasResize() {
    let canvas = document.querySelector('canvas');
    this.signaturePad.set('minWidth', 1);
    this.signaturePad.set('canvasWidth', canvas.offsetWidth);
    this.signaturePad.set('canvasHeight', canvas.offsetHeight);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FormInstallationPage');
  }

  previous() {
    this.step--;
  }

  next() {
    if (this.step === 1 && (!this.form.serie || this.form.serie.length < 9)) {
      alert('Debe ingresar la serie del optimizador y esta debe ser de por lo menos 9 dígitos');
      return;
    }
    if (this.step === 2 && !this.form.medidor) {
      alert('Debe ingresar un número de medidor para continuar');
      return;
    }
    this.step++;
    console.log(this.form);
    if (this.step == 9999) {
      window.setTimeout(() => {
        this.loadMap();
      }, 400)
    }
    if (this.step == 5) {
      window.setTimeout(() => {
        this.signaturePad.clear();
        this.canvasResize();
      }, 800)
    }
  }

  addMaterial() {
    this.current_materials.push({material: this.current_material, quantity: this.current_quantity});
  }

  drawCancel() {
  }

  drawComplete() {
    this.signatureImage = this.signaturePad.toDataURL();
    console.log(this.signatureImage);
    this.drawClear();
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
    this.medidorProvider.getById(this.form.medidor).valueChanges().subscribe((data: any) => {
      if (data) {
        this.form.nombre = data.nombre;
        this.form.calle = data.Direccion;
        this.form.colonia = data.colonia;
        this.form.ciudad = data.municipio + ', ' + data.estado;
        this.form.rpu = data.rpu;
        this.form.geolocation = {lat: data.lat, lng: data.lng};
        console.log(data);
      } else {
        const toast = this.toastController.create({message: 'Medidor no encontrado', duration: 4000, position: 'bottom'});
        toast.present();
      }
    }, (error) => {
      console.log(error);
    });
  }

  uploadPictures(formUid) {
    if (this.firmaCFE) {
      const firmaCFEId = Date.now();
      this.generalProvider.uploadPicture('firmas/cfe/' + firmaCFEId + '.jpg', this.firmaCFE).then(() => {
        this.generalProvider.getDownloadURL('firmas/cfe/' + firmaCFEId + '.jpg').subscribe((url) => {
          console.log('forms/' + formUid + '/firmaCFE', url);
          this.generalProvider.freeUpdate('forms/' + formUid + '/firmaCFE', url);
        });
      }).catch(() => {
        console.log('Falla al subir la FirmaCFE');
      });
    }
    if (this.firmaTroy) {
      const firmaTroyId = Date.now();
      this.generalProvider.uploadPicture('firmas/troy/' + firmaTroyId + '.jpg', this.firmaTroy).then(() => {
        this.generalProvider.getDownloadURL('firmas/troy/' + firmaTroyId + '.jpg').subscribe((url) => {
          console.log('forms/' + formUid + '/firmaTroy', url);
          this.generalProvider.freeUpdate('forms/' + formUid + '/firmaTroy', url);
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
            this.generalProvider.freeUpdate('forms/' + formUid + '/pictures/' + thisPictureId, url);
          });
        }).catch(() => {
          console.log('Falla al subir fotografía');
        });
      })
    }
  }

  finishFinish() {
    let loading = this.loadingCtrl.create({
      content: 'Por favor espera mientras se envía el formulario...'
    });
    loading.present();
    this.form.uid = (this.form.uid) ? this.form.uid : Date.now();
    delete this.form.pictures;
    this.form.user = this.user;
    this.form.current_materials = (this.form.guardado_offline) ? this.form.current_materials : this.materials;
    this.form.guardado_online = this.form.uid;
    this.formProvider.add(this.form).then((data) => {
      const toast = this.toastController.create({message: '¡Formulario enviado con éxito!', duration: 4000, position: 'bottom'});
      toast.present();
      this.uploadPictures(this.form.uid);
      const toast2 = this.toastController.create({message: 'Estamos subiendo las imágenes en estos momentos...', duration: 8000, position: 'top'});
      toast2.present();
      if (this.offline_forms) {
        this.offline_forms.forEach((of, i) => {
          if (of.uid == this.form.uid) {
            this.offline_forms.splice(i, 1);
            this.storage.set('offline_forms', JSON.stringify(this.offline_forms)).then((data) => {
            }).catch((error) => {
              console.log(error);
            });
          }
        });
      }
      this.step = 1;
      this.form = {};
      this.pictures = [];
      this.current_materials = [];
      this.materials.forEach((m) => {
        m.current_quantity = null;
      });
      loading.dismiss();
      this.navCtrl.pop();
    }).catch((error) => {
      alert('Ocurrió un error mientras se enviaba el formulario:  ' + JSON.stringify(error));
      loading.dismiss();
      console.log(error);
    });
  }

  finish() {
    let promiseMedidor: any;
    let promiseSerie: any;
    promiseSerie = this.formProvider.getSerieById(this.form.serie).valueChanges().subscribe((data) => {
      promiseSerie.unsubscribe();
      if (data) {
        alert('Este optimizador ya ha sido instalado. Verifique nuevamente la serie.');
        return;
      } else {
        promiseMedidor = this.formProvider.getMedidorById(this.form.medidor).valueChanges().subscribe((data) => {
          promiseMedidor.unsubscribe();
          if (data) {
            alert('Este medidor ya cuenta con instalación. Verifique nuevamente el número.');
            return;
          } else {
            this.finishFinish();
          }
        }, (error) => {
          alert('Ocurrió un error o no se cuenta con acceso a internet para verificar el número del medidor');
          console.log(error);
        });
      }
    }, (error) => {
      alert('Ocurrió un error o no se cuenta con acceso a internet para verificar la serie del aparato ingresado');
      console.log(error);
    });
  }

  loadMap() {
    // if (!this.coords) {
    //   return;
    // }
    // let mapOptions: GoogleMapOptions = {
    //   camera: {
    //     target: {
    //       lat: this.coords.latitude,
    //       lng: this.coords.longitude
    //     },
    //     zoom: 18,
    //     tilt: 30
    //   }
    // };
    //
    // this.map = GoogleMaps.create('map', mapOptions);
    //
    // let marker: Marker = this.map.addMarkerSync({
    //   title: 'Dirección del Usuario',
    //   icon: 'blue',
    //   animation: 'DROP',
    //   position: {
    //     lat: this.coords.latitude,
    //     lng: this.coords.longitude
    //   },
    //   draggable: true
    // });
    // this.map.on(GoogleMapsEvent.CAMERA_MOVE_END).subscribe((data) => {
    //   console.log(data);
    //   console.log(data.target);
    //   marker.setPosition({
    //     lat: data.target.lat,
    //     lng: data.target.lon
    //   });
    // });
    // this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe((data) => {
    //   marker.setPosition(data[0]);
    //   this.form.geolocation = data[0];
    //   this.form.geolocation_manual = true;
    //   const toast = this.toastController.create({message: 'Ubicación cambiada correctamente', duration: 4000, position: 'bottom'});
    //   console.log(this.form);
    //   toast.present();
    // });
  }

  async takePicture(source) {
    try {
      let cameraOptions: CameraOptions = {
        quality: 50,
        // targetWidth: 800,
        // targetHeight: 800,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        allowEdit: true
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

  finishOffline() {
    let loading = this.loadingCtrl.create({
      content: 'Por favor espera mientras se envía el formulario...'
    });
    loading.present();
    this.form.uid = Date.now();
    this.form.pictures = this.pictures;
    this.form.user = this.user;
    this.form.current_materials = this.materials;
    this.form.firmaCFE = this.firmaCFE;
    this.form.firmaTroy = this.firmaTroy;
    if (!this.form.guardado_offline) {
      this.form.guardado_offline = Date.now();
      this.offline_forms.push(this.form);
    } else {
      this.offline_forms.forEach((f, i) => {
        if (f.guardado_offline === this.form.guardado_offline) {
          this.offline_forms[i] = this.form;
          console.log(this.offline_forms);
        }
      });
    }
    this.storage.set('offline_forms', JSON.stringify(this.offline_forms)).then((data) => {
      loading.dismiss();
      const toast = this.toastController.create({message: '¡Formulario guardado localmente con éxito!', duration: 5000, position: 'bottom'});
      toast.present();
      this.step = 1;
      this.form = {};
      this.pictures = [];
      this.current_materials = [];
      this.materials.forEach((m) => {
        m.current_quantity = null;
      });
    }).catch((error) => {
      alert('Ocurrió un error mientras se guardaba el formulario:  ' + JSON.stringify(error));
      loading.dismiss();
      console.log(error);
    });
  }

  scanEcowise() {

    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data: ' + barcodeData.text);
      if(barcodeData.text){
        this.form.serie = barcodeData.text
      }
    }).catch(err => {
      console.log(err);
    });


    // this.navCtrl.push(ScanPage, {'data': this.form});
    // let profileModal = this.modalController.create(ScanPage, this.form);
    // profileModal.present();
    /*
    // Optionally request the permission early
    console.log('1');
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        console.log('2');
        if (status.authorized) {
          console.log('3');
          // camera permission was granted


          // start scanning
          this.qrScanner.show();
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            this.qrScanner.hide();
            console.log('Scanned something', text);
            this.form.serie = text;
            const toast = this.toastController.create({message: '¡Equipo con serie ' + text + ' ha sido escanneado con éxito!', duration: 5000, position: 'bottom'});
            toast.present();
            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
          });

        } else if (status.denied) {
          console.log('4');
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          console.log('5');
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
      */
  }
}
