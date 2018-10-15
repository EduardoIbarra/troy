import { Component, OnInit } from '@angular/core';
import {FormService} from "../services/form.service";
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import * as XLSX from 'xlsx';
import * as $ from 'jquery';
import { environment } from '../../environments/environment';
import {ReportsService} from "../services/reports.service";

@Component({
  selector: 'app-reports',
  templateUrl: './reportsCFE.component.html',
  styleUrls: ['./reportsCFE.component.css']
})
export class ReportsCFEComponent implements OnInit {
  form: any = {};
  forms: any = [];
  filteredForms: any = [];
  creating: boolean = false;
  query: string;
  fromDate: any;
  toDate: any;
  user: any;
  supervisados: any[] = [];
  users: any[] = [];
  selectedSupervisor: any;
  env = environment;
  conVarilla: any[] = [];
  constructor(private formService: FormService, private authService: AuthService, private userService: UserService,
              private reportsService: ReportsService) {
    this.userService.get().valueChanges().subscribe((data) => {
      this.users = data;
      console.log(this.users);
    }, (error) => {
      console.log(error);
    });
    this.authService.getStatus().subscribe((data) => {
      this.userService.getById(data.uid).valueChanges().subscribe((data2) => {
        this.user = data2;
        this.supervisados.push(this.user.uid);
        this.getForms();
      }, (error) => {
        console.log(error);
      });
    }, (error) => {
      this.supervisados.push(this.user.uid);
      this.getForms();
      console.log(error);
    });
  }

  ngOnInit() {
  }

  getForms() {
    this.formService.get().valueChanges().subscribe((data) => {
      this.forms = data;
      this.forms = this.forms.filter((f) => {return f.user && this.user.RPE == f.CFERpe});
      this.filteredForms = this.forms;
      this.conVarilla = this.filteredForms.filter((ff) => { return ff.varilla === 'si'});
    }, (error) => {
      console.log(error);
    });
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
    console.log(from, to);
    this.filteredForms = this.forms.filter((f) => { return f.uid >= from && f.uid <= to });
  }
  generateExcel() {
    let arrayOfArrays = [[],[],[],[]];
    const firstForm = this.filteredForms[0];
    const from = this.fromDate.day + '/' + this.fromDate.month + '/' + this.fromDate.year;
    const to = this.toDate.day + '/' + this.toDate.month + '/' + this.toDate.year;
    const conVarilla = this.filteredForms.filter((ff) => { return ff.varilla === 'si'});
    arrayOfArrays.push([null, null, 'INSTALACIÓN DE EQUIPOS OPTIMIZADORES DE TENSIÓN EN LOS ESTADOS DE SONORA Y SINALOA DE LOS ESTADOS UNIDOS MEXICANOS']);
    arrayOfArrays.push([null, null, null, null, null, 'R E S U M E N     D E     F O R M U L A R I O S     F I R M A D O S']);
    arrayOfArrays.push([null, null, null, null, null, null, null, null, 'FORMATO', 'TTD-HMO-ARSUB']);
    arrayOfArrays.push(['ESTADO', firstForm.ciudad.split(',')[1], null, 'CIUDAD', firstForm.ciudad.split(',')[0], null, null, null, 'PERIODO', from, to]);
    arrayOfArrays.push([]);
    arrayOfArrays.push(['SERVICIOS INSTALADOS TOTALES', this.filteredForms.length, null, 'SERVICIOS SIN SISTEMA DE TIERRA', this.filteredForms.length - conVarilla.length, null, 'SERVICIOS CON SISTEMA DE TIERRA', conVarilla.length]);
    arrayOfArrays.push([
      'CONSECUTIVO',
      'NO. SERIE OPTIMIZADOR',
      'NÚMERO DE MEDIDOR',
      'CALLE, NÚMERO',
      'COLONIA',
      'PUNTO X',
      'PUNTO Y',
      'SISTEMA DE TIERRA',
      'SUBCONTRATISTA',
      'SUPERVISOR TROY',
      'SUPERVISOR CFE'
    ]);
    this.filteredForms.forEach((aoa, i) => {
      arrayOfArrays.push([
        i + 1,
        (aoa.serie) ? '9000-0364-' + aoa.serie : null,
        aoa.medidor || null,
        (aoa.calle + ' ' + aoa.numero) || null,
        aoa.colonia || null,
        (aoa.geolocation) ? aoa.geolocation.lat : null,
        (aoa.geolocation) ? aoa.geolocation.lng : null,
        (aoa.varilla === 'si') ? 'Sí' : 'No',
        (aoa.instalo) ? aoa.instalo.nombre : null,
        (aoa.superviso) ? aoa.superviso.name + ' ' + aoa.superviso.last_name : null,
        aoa.CFENombre || null
      ]);
    });
    arrayOfArrays.push([]);
    arrayOfArrays.push([]);
    arrayOfArrays.push([]);
    arrayOfArrays.push([]);
    arrayOfArrays.push([]);
    arrayOfArrays.push([null, null, null, '_________________________', null, null, '_________________________']);
    arrayOfArrays.push([null, null, null, 'SUPERVISIÓN TROY T&D', null, null, 'SUBCONTRATISTA']);
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(arrayOfArrays);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'TTD-HMO-ARSUB');

    /* save to file */
    XLSX.writeFile(wb, 'Reporte.xlsx');
  }
  generateForSupervisor() {
    this.supervisados.push(this.selectedSupervisor.uid);
    this.userService.getBySupervisor(this.selectedSupervisor.uid).on("value", (response) => {
      this.supervisados = response.val() || [];
      if (this.supervisados) {
        this.supervisados = Object.keys(this.supervisados);
      }
      this.supervisados.push(this.selectedSupervisor.uid);
      this.getForms();
    });
    console.log(this.selectedSupervisor);
  }
  generateReport() {
    let arrayOfArrays: any[] = [];
    const firstForm = this.filteredForms[0];
    const from = this.fromDate.day + '/' + this.fromDate.month + '/' + this.fromDate.year;
    const to = this.toDate.day + '/' + this.toDate.month + '/' + this.toDate.year;
    this.filteredForms.forEach((aoa, i) => {
      arrayOfArrays.push([
        i + 1,
        aoa.serie || null,
        aoa.medidor || null,
        (aoa.calle + ' ' + aoa.numero) || null,
        aoa.colonia || null,
        (aoa.geolocation) ? aoa.geolocation.lat : null,
        (aoa.geolocation) ? aoa.geolocation.lng : null,
        (aoa.varilla === 'si') ? 'Sí' : 'No',
        (aoa.instalo) ? aoa.instalo.nombre : null,
        (aoa.superviso) ? aoa.superviso.name + ' ' + aoa.superviso.last_name : null,
        aoa.CFENombre || null
      ]);
    });
    this.reportsService.generateReport({
      table: arrayOfArrays,
      estado: firstForm.ciudad.split(',')[1],
      ciudad: firstForm.ciudad.split(',')[0],
      totales: this.filteredForms.length,
      sinTierra: this.filteredForms.length - this.conVarilla.length,
      conTierra: this.conVarilla.length,
      from: from,
      to: to}).subscribe((data: any) => {
      var $a = $("<a>");
      $a.attr("href","https://eduardoibarra.com/laravel/public/excel/TTD-HMO-ARSUB.xlsx");
      $("body").append($a);
      // $a.attr("download","file.xls");
      $a[0].click();
      $a.remove();
    }, (error) => {
      console.log(error);
    });
  }
}
