import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormInstallationPage } from './form-installation';
import {SignaturePadModule} from "angular2-signaturepad";

@NgModule({
  declarations: [
    FormInstallationPage,
  ],
  imports: [
    IonicPageModule.forChild(FormInstallationPage),
    SignaturePadModule,
  ],
})
export class FormInstallationPageModule {}
