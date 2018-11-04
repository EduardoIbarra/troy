import { Component, OnInit } from '@angular/core';
import {FormService} from "../services/form.service";
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  form: any = {};
  forms: any[] = [];
  creating: boolean = false;
  query: string;
  userSubscription: any;
  user: any;
  offset: number = 15;
  page: number = 1;
  pagedForms: any[] = [];
  formsPromise: any;
  constructor(private formService: FormService, private authService: AuthService, private userService: UserService, private router: Router,
              private spinner: NgxSpinnerService) {
    this.spinner.show();
    this.formsPromise = this.formService.get().valueChanges().subscribe((data) => {
      this.forms = data;
      this.pagedForms = this.forms.slice((this.page * this.offset), (this.page * this.offset) + this.offset);
      console.log(this.pagedForms);
      this.spinner.hide();
      this.formsPromise.unsubscribe();
    }, (error) => {
      this.spinner.hide();
      console.log(error);
    });
  }

  ngOnInit() {
    this.authService.getStatus().subscribe((data) => {
      if (!data) { return; }
      this.userSubscription = this.userService.getById(data.uid).valueChanges().subscribe((data) => {
        this.user = data;
        if (!this.user.superadmin) {
          this.router.navigate(['reports']);
        }
        this.userSubscription.unsubscribe();
      }, (error) => {
        console.log(error);
      });
    }, (error) => {
      console.log(error);
    });
  }

  next () {
    this.page++;
    this.pagedForms = this.forms.slice((this.page * this.offset), (this.page * this.offset) + this.offset);
  }

  prev () {
    this.page--;
    this.pagedForms = this.forms.slice((this.page * this.offset), (this.page * this.offset) + this.offset);
  }

  showAll () {
    this.page = 0;
    this.pagedForms = this.forms;
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
