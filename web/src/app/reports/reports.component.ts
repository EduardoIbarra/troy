import { Component, OnInit } from '@angular/core';
import {FormService} from "../services/form.service";
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
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
  constructor(private formService: FormService, private authService: AuthService, private userService: UserService) {
    this.authService.getStatus().subscribe((data) => {
      this.user = data;
      this.userService.getBySupervisor(this.user.uid).on("value", (response) => {
        this.supervisados = response.val();
        this.supervisados = Object.keys(this.supervisados);
        this.supervisados.push(this.user.uid);
        this.formService.get().valueChanges().subscribe((data) => {
          this.forms = data;
          this.forms = this.forms.filter((f) => {return this.supervisados.includes(f.user.uid)});
          this.filteredForms = this.forms;
          console.log(this.supervisados);
        }, (error) => {
          console.log(error);
        });
      });
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
    console.log(from, to);
    this.filteredForms = this.forms.filter((f) => { return f.uid >= from && f.uid <= to });
  }
}
