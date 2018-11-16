import { Component, OnInit } from '@angular/core';
import {FormService} from "../services/form.service";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {ReportsService} from "../services/reports.service";
import * as $ from 'jquery';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  form: any;
  constructor(private formService: FormService, private activatedRoute: ActivatedRoute, public sanitizer: DomSanitizer,
              private reportsService: ReportsService) {
    this.formService.getById(this.activatedRoute.snapshot.params['uid']).valueChanges().subscribe((data) => {
      this.form = data;
      console.log(this.form);
      if (this.form.pictures && this.form.pictures.constructor !== Array) {
        this.form.pictures =  Object.values(this.form.pictures);
      }
    }, (error) => {
      console.log(error);
    });
  }

  ngOnInit() {
  }

  generateReport() {
    this.reportsService.formReport({form: this.form}).subscribe((data: any) => {
      var $a = $("<a>");
      $a.attr("href","https://eduardoibarra.com/laravel/public/excel/Formulario.xlsx");
      $("body").append($a);
      $a[0].click();
      $a.remove();
    }, (error) => {
      console.log(error);
    });
  }

}
