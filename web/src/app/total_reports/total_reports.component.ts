import { Component, OnInit } from '@angular/core';
import {FormService} from "../services/form.service";
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-total_reports',
  templateUrl: './total_reports.component.html',
  styleUrls: ['./total_reports.component.css']
})
export class TotalReportsComponent implements OnInit {
  form: any = {};
  forms: any = [];
  filteredForms: any = [];
  creating: boolean = false;
  query: string;
  fromDate: any;
  toDate: any;
  user: any;
  supervisados: any[] = [];
  conVarilla: any[] = [];
  constructor(private formService: FormService, private authService: AuthService, private userService: UserService) {
    this.authService.getStatus().subscribe((data) => {
      this.user = data;
    }, (error) => {
      console.log(error);
    });
    this.formService.get().valueChanges().subscribe((data) => {
      this.forms = data;
      this.filteredForms = this.forms;
      this.conVarilla = this.filteredForms.filter((ff) => { return ff.varilla === 'si'});
      console.log(this.filteredForms);
    }, (error) => {
      console.log(error);
    });
  }

  ngOnInit() {
  }

  select(form) {
    this.form = form;
  }
  cancel() {
    this.form = {};
    this.creating = false;
  }
  remove(form) {
    if(!confirm('Desea eliminar este registro?')) {
      return;
    }
    this.formService.delete(form).then((data) => {
      alert('Eliminado con éxito');
    }).catch((error) => {
      alert('No se pudo eliminar, contactar a soporte');
      console.log(error);
    });
  }
  generate() {
    const from = new Date(this.fromDate.year + '/' + this.fromDate.month + '/' + this.fromDate.day + ' 00:00:00').getTime();
    const to = new Date(this.toDate.year + '/' + this.toDate.month + '/' + this.toDate.day + ' 23:59:59').getTime();
    this.filteredForms = this.forms.filter((f) => { return f.uid >= from && f.uid <= to });
    this.conVarilla = this.filteredForms.filter((ff) => { return ff.varilla === 'si'});
  }
  generateExcel() {
    let arrayOfArrays = [[],[],[],[]];
    const firstForm = this.filteredForms[0];
    const from = this.fromDate.day + '/' + this.fromDate.month + '/' + this.fromDate.year;
    const to = this.toDate.day + '/' + this.toDate.month + '/' + this.toDate.year;
    arrayOfArrays.push([null, null, null, null, null, null, 'DCO-001/2018']);
    arrayOfArrays.push([null, null, 'INSTALACIÓN DE EQUIPOS OPTIMIZADORES DE TENSIÓN EN LOS ESTADOS DE SONORA Y SINALOA DE LOS ESTADOS UNIDOS MEXICANOS']);
    arrayOfArrays.push([null, null, null, null, null, 'R E S U M E N     D E     E Q U I P O S     I N S T A L A D O S']);
    arrayOfArrays.push([null, null, null, null, null, null, null, null, 'FORMATO', 'RESUMEN TROY T&D']);
    arrayOfArrays.push(['ESTADO', firstForm.ciudad.split(',')[1], null, 'CIUDAD', firstForm.ciudad.split(',')[0], null, null, null, 'PERIODO', from, to]);
    arrayOfArrays.push([]);
    arrayOfArrays.push(['SERVICIOS INSTALADOS TOTALES', this.filteredForms.length, null, 'SERVICIOS SIN SISTEMA DE TIERRA', this.filteredForms.length - this.conVarilla.length, null, 'SERVICIOS CON SISTEMA DE TIERRA', this.conVarilla.length]);
    arrayOfArrays.push([
      'Consecutivo',
      'Nombre',
      '# Serie Optimizador',
      '# de Medidor',
      'Calle, Número',
      'Colonia',
      'Sistema de Tierra',
      'Subcontratista',
      'Supervisor Troy',
      'Supervisor CFE'
    ]);
    this.filteredForms.forEach((aoa, i) => {
      arrayOfArrays.push([
        i + 1,
        (aoa.user) ? aoa.user.name + ' ' + aoa.user.last_name : null,
        aoa.serie || null,
        aoa.medidor || null,
        (aoa.calle + ' ' + aoa.numero) || null,
        aoa.colonia || null,
        (aoa.varilla === 'si') ? 'Sí' : 'No',
        (aoa.instalo) ? aoa.instalo.nombre : null,
        (aoa.superviso) ? aoa.superviso.name + ' ' + aoa.superviso.last_name : null,
        aoa.CFENombre || null,
        'https://troy-da34b.firebaseapp.com//form/' + aoa.uid
      ]);
    });
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(arrayOfArrays);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'RESUMEN TROY T&D');

    /* save to file */
    XLSX.writeFile(wb, 'Resumen.xlsx');
  }
}
