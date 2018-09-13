import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {AngularFireModule} from "angularfire2";
import {AngularFireAuthModule} from "angularfire2/auth";
import {AngularFireDatabaseModule} from "angularfire2/database";
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { UserProvider } from '../providers/user/user';
import {LoginPageModule} from "../pages/login/login.module";
import {HttpClientModule} from "@angular/common/http";
import {AngularFireStorageModule} from "angularfire2/storage";
import {FormInstallationPageModule} from "../pages/form-installation/form-installation.module";
import {Geolocation} from "@ionic-native/geolocation";
import { MaterialProvider } from '../providers/material/material';
import {SignaturePadModule} from "angular2-signaturepad";
import { MedidorProvider } from '../providers/medidor/medidor';
import { FormProvider } from '../providers/form/form';
import {Camera} from "@ionic-native/camera";
import {IonicStorageModule} from "@ionic/storage";
import {QRScanner} from "@ionic-native/qr-scanner";
import {ScanPage} from "../pages/scan/scan";
import {FallidasPage} from "../pages/fallidas/fallidas";
import {FallidaPage} from "../pages/fallidas/fallida/fallida";
import { FallidaProvider } from '../providers/fallida/fallida';
import {VisitsPage} from "../pages/visits/visits";
import { GeneralProvider } from '../providers/general/general';

export const firebaseConfig = {
  apiKey: "AIzaSyAY_Sup07Nhaa6Cauh2rA7jOHi7uPZrgPk",
  authDomain: "troy-da34b.firebaseapp.com",
  databaseURL: "https://troy-da34b.firebaseio.com",
  projectId: "troy-da34b",
  storageBucket: "troy-da34b.appspot.com",
  messagingSenderId: "938370155886"
};
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ScanPage,
    FallidasPage,
    FallidaPage,
    VisitsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    LoginPageModule,
    HttpClientModule,
    AngularFireStorageModule,
    FormInstallationPageModule,
    SignaturePadModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ScanPage,
    FallidasPage,
    FallidaPage,
    VisitsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthenticationProvider,
    UserProvider,
    Geolocation,
    MaterialProvider,
    MedidorProvider,
    FormProvider,
    Camera,
    QRScanner,
    FallidaProvider,
    GeneralProvider
  ]
})
export class AppModule {}
