import {Component, OnInit} from '@angular/core';
import {FormService} from "../services/form.service";
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import * as _ from "lodash";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  form: any = {};
  forms: any[] = [];
  creating: boolean = false;
  query: string;
  queryType: any;
  userSubscription: any;
  user: any;
  page: number = 1;
  pagedForms: any[] = [];
  formsPromise: any;

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

  constructor(
    private formService: FormService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {

    /*this.spinner.show();

    this.formsPromise = this.formService.get().valueChanges().subscribe((data) => {
      this.forms = data;
      this.pagedForms = this.forms.slice((this.page * this.offset), (this.page * this.offset) + this.offset);
      console.log(this.pagedForms);
      this.spinner.hide();
      this.formsPromise.unsubscribe();
    }, (error) => {
      this.spinner.hide();
      console.log(error);
    });*/
  }

  ngOnInit() {
    this.getComments();
    window.setTimeout(() => {
      this.getComments();
    }, 1200);
    this.authService.getStatus().subscribe((data) => {
      if (!data) {
        return;
      }
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

  next() {
    this.page++;
    this.pagedForms = this.forms.slice((this.page * this.offset), (this.page * this.offset) + this.offset);
  }

  prev() {
    this.page--;
    this.pagedForms = this.forms.slice((this.page * this.offset), (this.page * this.offset) + this.offset);
  }

  showAll() {
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
    if (!confirm('Seguro que desea eliminar este registro?')) {
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
    this.getComments(this.nextKey)
  }

  prevPage() {
    const prevKey = _.last(this.prevKeys); // use last key in array
    this.prevKeys = _.dropRight(this.prevKeys); // then remove the last key in the array

    this.getComments(prevKey)
  }

  search() {
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
