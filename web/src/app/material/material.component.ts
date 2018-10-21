import { Component, OnInit } from '@angular/core';
import {FormService} from "../services/form.service";
import {UserService} from "../services/user.service";
import {FallidaService} from "../services/fallida.service";

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent implements OnInit {
  forms: any[] = [];
  varillas: any[] = [];
  fallidas: any[] = [];
  subcontratistas: any[] = [];
  usuarios: any[] = [];
  constructor(private formService: FormService,
              private userService: UserService,
              private fallidaService: FallidaService) {
    this.userService.get().valueChanges().subscribe((data) => {
      this.usuarios = data;
      this.formService.get().valueChanges().subscribe((data) => {
        this.forms = data;
        this.forms.forEach((f) => {
          f.user = this.usuarios.find((u) => { return u.uid === f.user.uid });
        });
        this.varillas = this.forms.filter((ff) => { return ff.varilla === 'si'});
        this.getSubcontratistas();
      }, (error) => {
        console.log(error);
      });
    }, (error) => {
      console.log(error);
    });
    this.fallidaService.get().valueChanges().subscribe((data) => {
      this.fallidas = data;
      console.log(data);
    }, (error) => {
      console.log(error);
    });
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
