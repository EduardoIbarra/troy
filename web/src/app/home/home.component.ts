import { Component, OnInit } from '@angular/core';
import {FormService} from "../services/form.service";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  form: any = {};
  forms: any = [];
  creating: boolean = false;
  query: string;
  constructor(private formService: FormService, private authService: AuthService) {
    this.formService.get().valueChanges().subscribe((data) => {
      this.forms = data;
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
    if(!confirm('Seguro que desea eliminar este registro?')) {
      return;
    }
    this.formService.deleteforUser(form.user.uid, form.uid).then((data) => {
      this.formService.delete(form.uid).then((data) => {
        alert('Eliminado con éxito');
      }).catch((error) => {
        alert('No se pudo eliminar, contactar a soporte');
        console.log(error);
      });
    }).catch((error) => {
      console.log(error);
    });
  }
}
