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
  seriesToDelete = [
    '9000-0364-183120492',
    '9000-0364-183120509',
    '9000-0364-183720923',
    '9000-0364-183712648',
    '9000-0364-183120517',
    '9000-0364-183121225',
    '9000-0364-183121232',
    '9000-0364-183121452',
    '9000-0364-183720884',
    '9000-0364-184222056',
    '9000-0364-184120317',
    '9000-0364-183720356',
    '9000-0364-183616263',
    '9000-0364-183120520',
    '9000-0364-183720302',
    '9000-0364-183618629',
    '9000-0364-183220213',
    '9000-0364-183722366',
    '9000-0364-183120257',
    '9000-0364-184020391',
    '9000-0364-183120179',
    '9000-0364-183320237',
    '9000-0364-183021582',
    '9000-0364-184222058',
    '9000-0364-183720298',
    '9000-0364-183120524',
    '9000-0364-183720265',
    '9000-0364-184120337',
    '9000-0364-183322303',
    '9000-0364-184222213',
    '9000-0364-183120470',
    '9000-0364-183120512',
    '9000-0364-183712363',
    '9000-0364-184020434',
    '9000-0364-183720286',
    '9000-0364-183621936',
    '9000-0364-183021585',
    '9000-0364-183220248',
    '9000-0364-183021500',
    '9000-0364-184222206',
    '9000-0364-183120508',
    '9000-0364-183120462',
    '9000-0364-183121212',
    '9000-0364-183121508',
    '9000-0364-183121472',
    '9000-0364-184222010',
    '9000-0364-183320225',
    '9000-0364-183120456',
    '9000-0364-183121065',
    '9000-0364-183121357',
    '9000-0364-183121425',
    '9000-0364-183615707',
    '9000-0364-183720310',
    '9000-0364-183615834',
    '9000-0364-183120487',
    '9000-0364-183121403',
    '9000-0364-183720320',
    '9000-0364-183712699',
    '9000-0364-183618842',
    '9000-0364-183620296',
    '9000-0364-184120282',
    '9000-0364-183616436',
    '9000-0364-183616265',
    '9000-0364-184221694',
    '9000-0364-183220202',
    '9000-0364-183121134',
    '9000-0364-183121459',
    '9000-0364-183121248',
    '9000-0364-184222027',
    '9000-0364-183121254',
    '9000-0364-183120263',
    '9000-0364-184020300',
    '9000-0364-183722373',
    '9000-0364-183720318',
    '9000-0364-183720315',
    '9000-0364-183120447',
    '9000-0364-183120525',
    '9000-0364-183120503',
    '9000-0364-183320222',
    '9000-0364-183121436',
    '9000-0364-183721241',
    '9000-0364-183120387',
    '9000-0364-184221473',
    '9000-0364-183121180',
    '9000-0364-183120490',
    '9000-0364-183121524',
    '9000-0364-183220217',
    '9000-0364-183121405',
    '9000-0364-183720946',
    '9000-0364-183615842',
    '9000-0364-183120486',
    '9000-0364-183021561',
    '9000-0364-183121379',
    '9000-0364-183616434',
    '9000-0364-183320284',
    '9000-0364-184221131',
    '9000-0364-183413542',
    '9000-0364-183320934',
    '9000-0364-183721027',
    '9000-0364-183722424',
    '9000-0364-184412324',
    '9000-0364-183722381',
    '9000-0364-183720569',
    '9000-0364-183720496',
    '9000-0364-183121457',
    '9000-0364-183422048',
    '9000-0364-183722431',
    '9000-0364-183722114',
    '9000-0364-183720323',
    '9000-0364-184222168',
    '9000-0364-183520621',
    '9000-0364-183320958',
    '9000-0364-183722466',
    '9000-0364-183721864',
    '9000-0364-183720547',
    '9000-0364-184220546',
    '9000-0364-183722346',
    '9000-0364-183722107',
    '9000-0364-183711380',
    '9000-0364-184212852',
    '9000-0364-183620096',
    '9000-0364-183721030',
    '9000-0364-184020170',
    '9000-0364-183520618',
    '9000-0364-183722463',
    '9000-0364-183121233',
    '9000-0364-184411319',
    '9000-0364-184222127',
    '9000-0364-184212877',
    '9000-0364-183520620',
    '9000-0364-184215139',
    '9000-0364-183722170',
    '9000-0364-184220762',
    '9000-0364-184020636',
    '9000-0364-184411652',
    '9000-0364-184411470',
    '9000-0364-184222082',
    '9000-0364-183720951',
    '9000-0364-184220827',
    '9000-0364-183621336',
    '9000-0364-183721918',
    '9000-0364-183710886',
    '9000-0364-183320220',
    '9000-0364-183620424'
  ];
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
    // this.seriesToDelete.forEach(s => this.formService.deleteSerie(s));
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
