import { Component, OnInit } from '@angular/core';
import {FormService} from "../services/form.service";
import {UserService} from "../services/user.service";
import {FallidaService} from "../services/fallida.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-global',
  templateUrl: './global.component.html',
  styleUrls: ['./global.component.css']
})
export class GlobalComponent implements OnInit {
  forms: any[] = [];
  varillas: any[] = [];
  fallidas: any[] = [];
  subcontratistas: any[] = [];
  usuarios: any[] = [];
  constructor(private formService: FormService,
              private userService: UserService,
              private fallidaService: FallidaService,
              private spinner: NgxSpinnerService) {
    alert('Estamos optimizando el sitio, disculpe las molestias');
    return;
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
  }

  ngOnInit() {
  }

  getSubcontratistas() {
    this.userService.getSubcontratistas().valueChanges().subscribe((data) => {
      this.subcontratistas = data;
      this.subcontratistas.forEach((s) => {
        s.instalaciones = this.forms.filter((f) => {return f.user && f.user.company && f.user.company.id == s.id}).length;
      });
      this.subcontratistas.sort((a,b) => (a.instalaciones < b.instalaciones) ? 1 : ((b.instalaciones < a.instalaciones) ? -1 : 0));
    }, (error) => {
      console.log(error);
    });
  }
}
