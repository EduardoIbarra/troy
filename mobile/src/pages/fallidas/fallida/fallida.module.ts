import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FallidaPage } from './fallida';
import {SignaturePadModule} from "angular2-signaturepad";

@NgModule({
  declarations: [
    FallidaPage,
  ],
  imports: [
    IonicPageModule.forChild(FallidaPage),
    SignaturePadModule
  ],
})
export class FallidaPageModule {}
