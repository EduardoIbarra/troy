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
import { ReportsComponent } from './reports/reports.component';

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {canActivate: [AuthenticationGuard], path: '', component: HomeComponent},
  {canActivate: [AuthenticationGuard], path: 'home', component: HomeComponent},
  {canActivate: [AuthenticationGuard], path: 'medidores', component: MedidoresComponent},
  {canActivate: [AuthenticationGuard], path: 'usuarios', component: UsuariosComponent},
  {canActivate: [AuthenticationGuard], path: 'form/:uid', component: FormComponent},
  {canActivate: [AuthenticationGuard], path: 'fallidas', component: FallidasComponent},
  {canActivate: [AuthenticationGuard], path: 'fallida/:medidor', component: FallidaComponent},
  {canActivate: [AuthenticationGuard], path: 'reports', component: ReportsComponent}
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
    ReportsComponent
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
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
