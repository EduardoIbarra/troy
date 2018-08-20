import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {Geolocation} from "@ionic-native/geolocation";
import {MaterialProvider} from "../../providers/material/material";
import {SignaturePad} from "angular2-signaturepad/signature-pad";
import {MedidorProvider} from "../../providers/medidor/medidor";
import {FormProvider} from "../../providers/form/form";
import {GoogleMapOptions, GoogleMaps, GoogleMapsEvent, Marker} from "@ionic-native/google-maps";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {UserProvider} from "../../providers/user/user";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import { Storage } from '@ionic/storage';
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
  materials:any [] = [];
  current_materials:any [] = [];
  current_material: any;
  current_quantity: any;
  last_step = 6;
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  coords: any;
  pictures: any[] = [];
  user: any;
  @ViewChild(SignaturePad) public signaturePad : SignaturePad;
  public signaturePadOptions : Object = {
    'minWidth': 2,
    'canvasWidth': 340,
    'canvasHeight': 200
  };
  public signatureImage : string;
  offline_forms:any [] = [];
  showing = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation, private materialProvider: MaterialProvider, private medidorProvider: MedidorProvider, private toastController: ToastController, private formProvider: FormProvider, private loadingCtrl: LoadingController, private camera: Camera, private authService: AuthenticationProvider, private userProvider: UserProvider, private storage: Storage) {
    if (this.navParams.get('form')) {
      this.form = this.navParams.get('form');
      this.pictures = this.form.pictures;
      this.user = this.form.user;
      this.current_materials = this.form.current_materials;
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
    this.geolocation.getCurrentPosition().then((resp) => {
      this.form.geolocation = {lat: resp.coords.latitude, lng: resp.coords.longitude};
      console.log(resp.coords);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.coords = data.coords;
      console.log(data.coords);
    });
    this.materialProvider.get().valueChanges().subscribe((data) => {
      this.materials = data;
      console.log(this.materials);
    }, (error) => {
      console.log(error);
    });
    this.authService.getStatus().subscribe((data) => {
      if (!data) {
        return;
      }
      this.userProvider.getById(data.uid).valueChanges().subscribe((data) => {
        this.user = data;
      }, (error) => {
        console.log(error);
      });
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad FormInstallationPage');
  }

  previous() {
    this.step--;
  }
  next() {
    this.step++;
    console.log(this.form);
    if(this.step == 4) {
      window.setTimeout(() => {
        this.loadMap();
      }, 400)
    }
    if(this.step == 6) {
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
        this.form.numero = data.numero;
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
  finish() {
    let loading = this.loadingCtrl.create({
      content: 'Por favor espera mientras se envía el formulario...'
    });
    loading.present();
    this.form.uid = (this.form.uid) ? this.form.uid : Date.now();
    this.form.pictures = this.pictures;
    this.form.user = this.user;
    this.form.current_materials = this.current_materials;
    this.form.guardado_online = this.form.uid;
    this.formProvider.add(this.form).then((data) => {
      const toast = this.toastController.create({message: '¡Formulario enviado con éxito!', duration: 4000, position: 'bottom'});
      toast.present();
      if (this.offline_forms) {
        this.offline_forms.forEach((of, i) => {
          if (of.uid == this.form.uid) {
            this.offline_forms.splice(i, 1);
            this.storage.set('offline_forms', JSON.stringify(this.offline_forms)).then((data) => {
              loading.dismiss();
            }).catch((error) => {
              console.log(error);
            });
          }
        });
      }else {
        loading.dismiss();
      }
      this.step = 1;
      this.form = {};
      this.pictures = [];
      this.current_materials = [];
    }).catch((error) => {
      alert('Ocurrió un error mientras se enviaba el formulario:  ' + JSON.stringify(error));
      loading.dismiss();
      console.log(error);
    });
  }
  loadMap() {
    if (!this.coords) {
      return;
    }
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: this.coords.latitude,
          lng: this.coords.longitude
        },
        zoom: 18,
        tilt: 30
      }
    };

    this.map = GoogleMaps.create('map', mapOptions);

    let marker: Marker = this.map.addMarkerSync({
      title: 'Dirección del Usuario',
      icon: 'blue',
      animation: 'DROP',
      position: {
        lat: this.coords.latitude,
        lng: this.coords.longitude
      },
      draggable: true
    });
    this.map.on(GoogleMapsEvent.CAMERA_MOVE_END).subscribe((data) => {
      console.log(data);
      console.log(data.target);
      marker.setPosition({
        lat: data.target.lat,
        lng: data.target.lon
      });
    });
    this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe((data) => {
      marker.setPosition(data[0]);
      this.form.geolocation = data[0];
      this.form.geolocation_manual = true;
      const toast = this.toastController.create({message: 'Ubicación cambiada correctamente', duration: 4000, position: 'bottom'});
      console.log(this.form);
      toast.present();
    });
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
      cameraOptions.sourceType = (source == 'camera') ?  this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY;
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
    this.form.current_materials = this.current_materials;
    this.form.guardado_offline = Date.now();
    this.offline_forms.push(this.form);
    this.storage.set('offline_forms', JSON.stringify(this.offline_forms)).then((data) => {
      loading.dismiss();
      const toast = this.toastController.create({message: '¡Formulario guardado localmente con éxito!', duration: 5000, position: 'bottom'});
      toast.present();
      this.step = 1;
      this.form = {};
      this.pictures = [];
      this.current_materials = [];
    }).catch((error) => {
      alert('Ocurrió un error mientras se guardaba el formulario:  ' + JSON.stringify(error));
      loading.dismiss();
      console.log(error);
    });
  }
}
