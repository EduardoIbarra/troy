import { Component, OnInit } from '@angular/core';
import {FormService} from "../services/form.service";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  form: any;
  constructor(private formService: FormService, private activatedRoute: ActivatedRoute, public sanitizer: DomSanitizer) {
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

}
