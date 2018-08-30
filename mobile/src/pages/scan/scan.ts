import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {QRScanner, QRScannerStatus} from "@ionic-native/qr-scanner";
import {FormProvider} from "../../providers/form/form";

/**
 * Generated class for the ScanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html',
})
export class ScanPage {
  form:any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private toastController: ToastController,
              private qrScanner: QRScanner,
              private formProvider: FormProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanPage');
    this.scanEcowise();
    console.log(this.navParams.get('data'));
    this.form = this.navParams.get('data');
  }
  ionViewWillLeave() {
    this.qrScanner.hide();
    this.qrScanner.destroy();
  }
  scanEcowise() {
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
            this.formProvider.getSerieById(text).valueChanges().subscribe((data) => {
              if(data) {
                alert('Esta serie ya se encuentra registrada en el sistema');
                this.qrScanner.hide(); // hide camera preview
                scanSub.unsubscribe(); // stop scanning
                this.qrScanner.destroy();
                this.navCtrl.pop();
              }else {
                this.form.serie = text;
                const toast = this.toastController.create({message: '¡Equipo con serie ' + text + ' ha sido escanneado con éxito!', duration: 5000, position: 'bottom'});
                toast.present();
                this.qrScanner.hide(); // hide camera preview
                scanSub.unsubscribe(); // stop scanning
                this.qrScanner.destroy();
                this.navCtrl.pop();
              }
            }, (error) => {
              alert('Ocurrió un error o no se cuenta con acceso a internet para verificar la serie del aparato escanneado');
              console.log(error);
            });
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
  }

}
