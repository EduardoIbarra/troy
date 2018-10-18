import { Component, OnInit } from '@angular/core';
import {FormService} from "../services/form.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MedidorService} from "../services/medidor.service";
import {DomSanitizer} from "@angular/platform-browser";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.css']
})
export class AddFormComponent implements OnInit {
  today = Date.now();
  step = 1;
  form: any = {};
  materials:any [] = [];
  current_materials:any [] = [];
  current_material: any;
  current_quantity: any;
  last_step = 6;
  map: any;
  coords: any;
  pictures: any[] = [];
  user: any;
  showing = false;
  employees:any[] = [];
  firmaCFE:string;
  firmaTroy:string;
  supervisores:any[] = [];
  constructor(private formService: FormService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private medidorService: MedidorService,
              public sanitizer: DomSanitizer,
              public userService: UserService) {
    this.userService.getSubcontratistas().valueChanges().subscribe((data) => {
      this.employees = data;
      console.log(this.employees);
    }, (error) => {
      console.log(error);
    });
    this.userService.getSupervisors().on('value', (data) => {
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
  ngOnInit() { }
  previous() {
    this.step--;
  }
  next() {
    if (this.step === 1 && (!this.form.serie || this.form.serie.length < 9)) {
      alert('Debe ingresar un número de serie de optimizador mayor a 9 dígitos');
      return;
    }
    if (this.step === 2 && !this.form.medidor) {
      alert('Debe ingresar un número de medidor para continuar');
      return;
    }
    this.step++;
    console.log(this.form);
    if(this.step == 4) {
      window.setTimeout(() => {
        // this.loadMap();
      }, 400)
    }
    if(this.step == 6) {
      window.setTimeout(() => {
        // this.signaturePad.clear();
        // this.canvasResize();
      }, 800)
    }
  }
  finish() {
    this.form.uid = Date.now();
    this.formService.add(this.form).then((data) => {
      alert('Guardado con éxito');
      this.router.navigate(['/home']);
    }).catch((error) => {
      alert('Ocurrió un error mientras se enviaba el formulario:  ' + JSON.stringify(error));
      console.log(error);
    });
  }
  searchMedidor() {
    this.medidorService.getById(this.form.medidor).valueChanges().subscribe((data: any) => {
      if(data) {
        this.form.nombre = data.nombre;
        this.form.calle = data.Direccion;
        this.form.colonia = data.colonia;
        this.form.ciudad = data.municipio + ', ' + data.estado;
        this.form.rpu = data.rpu;
        this.form.geolocation = {lat: data.lat, lng: data.lng};
        console.log(data);
      }else {
        alert('Medidor no encontrado');
      }
    }, (error) => {
      console.log(error);
    });
  }
}
