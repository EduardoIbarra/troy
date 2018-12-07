import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormService} from "../services/form.service";
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import * as XLSX from 'xlsx';
import * as $ from 'jquery';
import {ReportsService} from "../services/reports.service";
import {NgxSpinnerService} from "ngx-spinner";
import {GeneralService} from "../services/general.service";
import {concat} from "rxjs";
import {MedidorService} from "../services/medidor.service";
import * as _ from "lodash";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
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
  conVarilla: any[] = [];
  formsSubscription: any;
  usersSupervised: any[] = [];
  spinnerFlag = false;
  nullForms: any[] = [];
  offset: number = 15;
  nextKey: any; // for next button
  prevKeys: any[] = []; // for prev button
  subscription: any;
  searchQueryChild: any = [
    {text: 'RPU', value: 'rpu'},
    {text: 'Medidor', value: 'medidor'},
    {text: 'Optimizador', value: 'serie'},
    {text: 'Nombre', value: 'nombre'},
  ];
  pagedForms: any[] = [];
  queryType: any = {
    value: null,
    text: null
  };
  constructor(private formService: FormService, private authService: AuthService, private userService: UserService,
              private reportsService: ReportsService,
              private spinner: NgxSpinnerService,
              private generalService: GeneralService,
              private changeDetectorRef: ChangeDetectorRef,
              private medidorService: MedidorService) {
    const subscription = this.userService.get().valueChanges().subscribe((data) => {
      this.users = data;
      subscription.unsubscribe();
      this.authService.getStatus().subscribe((data) => {
        const subscription = this.userService.getById(data.uid).valueChanges().subscribe((data2) => {
          this.user = data2;
          subscription.unsubscribe();
          this.userService.getBySupervisor(this.user.uid).on("value", (response) => {
            this.supervisados = response.val() || [];
            if (this.supervisados) {
              this.supervisados = Object.keys(this.supervisados);
            }
            this.supervisados.push(this.user.uid);
            if (!this.user.superadmin) {
              this.usersSupervised = this.users.filter((u) => {return this.supervisados.includes(u.uid)});
            } else {
              this.usersSupervised = this.users;
            }
          });
        });
      });
    }, (error) => {
      console.log(error);
    });
  }

  ngOnInit() {
    // this.generalService.freeUpdate('totals/forms', 1);
    // this.updaeMedidores();
  }
  getNullRPU() {
    let noRPUArray:any [] = [];
    this.spinner.show();
    this.formService.getNullRPU().on("value", (response) => {
      if (response.val()) {
        // noRPUArray.push(response.val());
        // noRPUArray = Object.keys(response.val()).map(key => { return response.val()[key]; });
        noRPUArray = Object.values(response.val());
      }
      this.spinner.hide();
      console.info(noRPUArray);
      this.nullForms = noRPUArray;
      this.changeDetectorRef.detectChanges();
      return;
    });
  }
  updaeMedidores() {
    /*let sub = this.formService.get().valueChanges().subscribe(forms => {
      sub.unsubscribe();
      forms.forEach((form: any) => {
        let sub2 = this.medidorService.getById(form.medidor).valueChanges().subscribe((medidor: any) => {
          sub2.unsubscribe();
          this.generalService.freeUpdate('forms/' + form.uid + '/geolocation', {lat: medidor.lat, lng: medidor.lng});
        });
      })
    });*/
  }
  showForms() {
    this.authService.getStatus().subscribe((data) => {
      const subscription = this.userService.getById(data.uid).valueChanges().subscribe((data2) => {
        this.user = data2;
        this.supervisados.push(this.user.uid);
        this.userService.getBySupervisor(this.user.uid).on("value", (response) => {
          this.supervisados = response.val() || [];
          if (this.supervisados) {
            this.supervisados = Object.keys(this.supervisados);
          }
          this.supervisados.push(this.user.uid);
          if (!this.user.superadmin) {
            this.users = this.users.filter((u) => {return this.supervisados.includes(u.uid)});
          }
          this.getForms();
        });
        subscription.unsubscribe();
      }, (error) => {
        console.log(error);
      });
    }, (error) => {
      this.supervisados.push(this.user.uid);
      this.getForms();
      console.log(error);
    });
  }

  getForms() {
    /*if (!this.fromDate || !this.toDate || false) {
      alert('Por favor escoja fechas de inicio Y fin');
      return;
    }*/
    this.supervisados.forEach((s, i) => {
      this.spinnerFlag = true;
      this.formService.getForSupervisor(s).on("value", (response) => {
        if (response.val()) {
          console.log(response.val());
          console.log(1);
          const from = new Date(this.fromDate.year + '/' + this.fromDate.month + '/' + this.fromDate.day + ' 00:00:00').getTime();
          const to = new Date(this.toDate.year + '/' + this.toDate.month + '/' + this.toDate.day + ' 23:59:59').getTime();
          console.log(2);
          // let formsArray = Object.keys(response.val()).map(key => { return response.val()[key]; });
          let formsArray = Object.values(response.val());
          console.log(3);
          formsArray = formsArray.filter((f: any) => { return f.uid >= from && f.uid <= to });
          console.log(4);
          this.filteredForms = this.forms.concat(formsArray);
          console.log(5);
          this.conVarilla = this.filteredForms.filter((ff) => { return ff.varilla === 'si'});
          console.log(6);
          this.spinnerFlag = false;
        } else {
          this.spinnerFlag = false;
          alert('No se encontraron formularios para este supervisor');
        }
        console.info(this.filteredForms);
        this.changeDetectorRef.detectChanges();
      });
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
    this.getForms();
    /*const from = new Date(this.fromDate.year + '/' + this.fromDate.month + '/' + this.fromDate.day + ' 00:00:00').getTime();
    const to = new Date(this.toDate.year + '/' + this.toDate.month + '/' + this.toDate.day + ' 23:59:59').getTime();
    this.filteredForms = this.forms.filter((f) => { return f.uid >= from && f.uid <= to });*/
  }
  generateExcel() {
    let arrayOfArrays = [[],[],[],[]];
    const firstForm = this.filteredForms[0];
    const from = this.fromDate.day + '/' + this.fromDate.month + '/' + this.fromDate.year;
    const to = this.toDate.day + '/' + this.toDate.month + '/' + this.toDate.year;
    this.conVarilla = this.filteredForms.filter((ff) => { return ff.varilla === 'si'});
    arrayOfArrays.push([null, null, 'INSTALACIÓN DE EQUIPOS OPTIMIZADORES DE TENSIÓN EN LOS ESTADOS DE SONORA Y SINALOA DE LOS ESTADOS UNIDOS MEXICANOS']);
    arrayOfArrays.push([null, null, null, null, null, 'R E S U M E N     D E     E Q U I P O S     I N S T A L A D O S']);
    arrayOfArrays.push([null, null, null, null, null, null, null, null, 'FORMATO', 'TTD-HMO-ARSUB']);
    arrayOfArrays.push(['ESTADO', firstForm.ciudad.split(',')[1], null, 'CIUDAD', firstForm.ciudad.split(',')[0], null, null, null, 'PERIODO', from, to]);
    arrayOfArrays.push([]);
    arrayOfArrays.push(['SERVICIOS INSTALADOS TOTALES', this.filteredForms.length, null, 'SERVICIOS SIN SISTEMA DE TIERRA', this.filteredForms.length - this.conVarilla.length, null, 'SERVICIOS CON SISTEMA DE TIERRA', this.conVarilla.length]);
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
        ((aoa.calle || '') + ' ' + (aoa.numero || '')) || null,
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
        ((aoa.calle || '') + ' ' + (aoa.numero || '')) || null,
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
      estado: (firstForm.ciudad) ? firstForm.ciudad.split(',')[1] : 'N/A',
      ciudad: (firstForm.ciudad) ? firstForm.ciudad.split(',')[0] : 'N/A',
      totales: this.filteredForms.length,
      sinTierra: this.filteredForms.length - this.conVarilla.length,
      conTierra: this.conVarilla.length,
      from: from,
      to: to}).subscribe((data: any) => {
      var $a = $("<a>");
      $a.attr("href","https://eduardoibarra.com/laravel/public/excel/TTD-HMO-ARSUB.xlsx");
      $("body").append($a);
      $a[0].click();
      $a.remove();
    }, (error) => {
      console.log(error);
    });
  }

  generateReportMultiple() {
    let forms: any[];
    forms = this.filteredForms.filter((f) => {return f.selected});
    if(!forms || forms.length <= 0) {
      alert('Debe seleccionar por lo menos un formulario para descargarlo');
      return;
    }
    this.spinner.show();
    this.reportsService.generateReportMultiple({forms: forms}).subscribe((data: any) => {
      var $a = $("<a>");
      $a.attr("href","https://eduardoibarra.com/laravel/public/" + data.path);
      $("body").append($a);
      $a[0].click();
      $a.remove();
      this.spinner.hide();
    }, (error) => {
      alert('Ocurrió un error');
      console.log(error);
      this.spinner.hide();
    });
    alert('Generando archivo zip, esto puede tardar unos minutos...');
  }

  toggleAll() {
    this.filteredForms.forEach((f) => {f.selected = !f.selected});
  }

  private getComments(key?) {

    this.formService.getPaged(this.offset, key).on("value", (response) => {
      console.info(response.val());
      if (response.val()) {
        this.pagedForms = this.forms.concat(Object.keys(response.val()).map(key => {
          return response.val()[key];
        }));
        this.pagedForms = _.slice(this.pagedForms, 0, this.offset);
        this.nextKey = _.get(this.pagedForms[this.offset - 1], 'uid');
        console.log(this.nextKey);
      }
    });
  }

  nextPage() {
    this.prevKeys.push(_.first(this.pagedForms)['uid']); // set current key as pointer for previous page
    // this.getForms(this.nextKey)
  }

  prevPage() {
    const prevKey = _.last(this.prevKeys); // use last key in array
    this.prevKeys = _.dropRight(this.prevKeys); // then remove the last key in the array

    // this.getForms(prevKey)
  }

  search() {
    if (!this.queryType.value || !this.query) return;

    this.spinner.show();
    this.formService.search(this.queryType.value, this.query).then((res) => {
      if (!res.val()) return;
      console.log(res.val());
      let forms = res.val();
      let keys = Object.keys(res.val());
      this.pagedForms = [];
      for (let key of keys) {
        this.pagedForms.push(forms[key])
      }
    }).catch((error) => {
      console.log(error);
    }).then(() => {
      this.spinner.hide();
    })
  }
}
