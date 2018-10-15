import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AngularFireModule} from "angularfire2";
import {AngularFireAuthModule} from "angularfire2/auth";
import {AngularFireStorageModule} from "angularfire2/storage";
import {AngularFirestoreModule} from "angularfire2/firestore";
import {environment} from "../environments/environment";
import {AngularFireDatabaseModule} from "angularfire2/database";
import { LoginComponent } from './login/login.component';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule} from "@angular/forms";
import { HomeComponent } from './home/home.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { MedidoresComponent } from './medidores/medidores.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import {SearchPipe} from "./pipes/search";
import { FormComponent } from './form/form.component';
import {AuthenticationGuard} from "./authentication.guard";
import { FallidasComponent } from './fallidas/fallidas.component';
import { FallidaComponent } from './fallidas/fallida/fallida.component';
import {ReportsComponent} from './reports/reports.component';
import {TotalReportsComponent} from "./total_reports/total_reports.component";
import { EditFormComponent } from './edit-form/edit-form.component';
import { GlobalComponent } from './global/global.component';
import {ReportsCFEComponent} from "./reportsCFE/reportsCFE.component";
import {HttpClientModule} from "@angular/common/http";

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {canActivate: [AuthenticationGuard], path: '', component: ReportsComponent},
  {canActivate: [AuthenticationGuard], path: 'home', component: HomeComponent},
  {canActivate: [AuthenticationGuard], path: 'medidores', component: MedidoresComponent},
  {canActivate: [AuthenticationGuard], path: 'usuarios', component: UsuariosComponent},
  {canActivate: [AuthenticationGuard], path: 'form/:uid', component: FormComponent},
  {canActivate: [AuthenticationGuard], path: 'edit_form/:uid', component: EditFormComponent},
  {canActivate: [AuthenticationGuard], path: 'fallidas', component: FallidasComponent},
  {canActivate: [AuthenticationGuard], path: 'fallida/:medidor', component: FallidaComponent},
  {canActivate: [AuthenticationGuard], path: 'reports', component: ReportsComponent},
  {canActivate: [AuthenticationGuard], path: 'reportsCFE', component: ReportsCFEComponent},
  {canActivate: [AuthenticationGuard], path: 'total_reports', component: TotalReportsComponent},
  {canActivate: [AuthenticationGuard], path: 'global', component: GlobalComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MedidoresComponent,
    UsuariosComponent,
    SearchPipe,
    FormComponent,
    FallidasComponent,
    FallidaComponent,
    ReportsComponent,
    TotalReportsComponent,
    EditFormComponent,
    GlobalComponent,
    ReportsCFEComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase, 'my-app-name'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
