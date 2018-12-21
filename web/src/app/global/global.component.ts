import {Component, OnInit} from '@angular/core';
import {FormService} from "../services/form.service";
import {UserService} from "../services/user.service";
import {FallidaService} from "../services/fallida.service";
import {NgxSpinnerService} from "ngx-spinner";
import {TotalsService} from "../services/totals.service";

@Component({
  selector: 'app-global',
  templateUrl: './global.component.html',
  styleUrls: ['./global.component.scss']
})
export class GlobalComponent implements OnInit {
  forms: any[] = [];
  varillas: any[] = [];
  fallidas: any[] = [];
  subcontratistas: any[] = [];
  usuarios: any[] = [];

  totals: any = {
    fallidas: null,
    forms: null,
    varillas: null
  };

  constructor(private formService: FormService,
              private userService: UserService,
              private fallidaService: FallidaService,
              private totalsService: TotalsService,
              private spinner: NgxSpinnerService) {
    // TODO: no borrar, tal vez lo necesitemos para ajustar los totales manualmente
    /*const subscription = this.userService.get().valueChanges().subscribe((data) => {
      this.usuarios = data;
      this.spinner.show();
      const subscription2 = this.formService.get().valueChanges().subscribe((data) => {
        this.spinner.hide();
        this.forms = data;
        this.forms.forEach((f) => {
          f.user = this.usuarios.find((u) => { return f.user && u.uid === f.user.uid });
        });
        this.varillas = this.forms.filter((ff) => { return ff.varilla === 'si'});
        console.log(this.forms.length);
        console.log(this.varillas.length);
        this.getSubcontratistas();
        subscription2.unsubscribe();
      }, (error) => {
        console.log(error);
      });
      subscription.unsubscribe();
    }, (error) => {
      console.log(error);
    });
    const subscription3 = this.fallidaService.get().valueChanges().subscribe((data) => {
      this.fallidas = data;
      console.log(data);
      subscription3.unsubscribe();
    }, (error) => {
      console.log(error);
    });*/

    this.getSubcontratistas();
  }

  ngOnInit() {
    this.totalsService.getTotals().valueChanges().subscribe((res) => {
      console.log(res);
      this.totals.fallidas = res[0];
      this.totals.forms = res[1];
      this.totals.varillas = res[5];
      this.spinner.hide()
    })
  }

  getSubcontratistas() {
    this.spinner.show()
    this.userService.getSubcontratistas().valueChanges().subscribe((data) => {
      this.subcontratistas = data;
      this.totalsService.getTotals().valueChanges().subscribe((data2) => {
        const totalsArray = Object.values(data2[2]);
        this.subcontratistas.forEach((s) => {
          const record = totalsArray.find((ta) => { return ta.id === s.id});
          s.instalaciones = (record) ? record.total : 0;
        });
        this.subcontratistas.sort((a, b) => (a.instalaciones < b.instalaciones) ? 1 : ((b.instalaciones < a.instalaciones) ? -1 : 0));
      }, (error) => {
        console.log(error);
      });
    }, (error) => {
      console.log(error);
    });
  }
}
