import { Component, OnInit } from '@angular/core';
import {FormService} from "../services/form.service";
import {UserService} from "../services/user.service";
import {FallidaService} from "../services/fallida.service";
import {MaterialService} from "../services/material.service";

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
  materials: any[] = [];
  selectedSupervisor: any;
  constructor(private formService: FormService,
              private userService: UserService,
              private fallidaService: FallidaService,
              private materialService: MaterialService) {
    this.userService.get().valueChanges().subscribe((data) => {
      this.usuarios = data;
      this.formService.get().valueChanges().subscribe((data) => {
        this.forms = data;
        this.getMaterials();
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
    }, (error) => {
      console.log(error);
    });
  }

  getMaterials() {
    this.materialService.get().valueChanges().subscribe((data) => {
      this.materials = data;
      this.calculateMaterials(this.forms);
    }, (error) => {
      console.log(error);
    });
  }

  calculateMaterials(forms) {
    this.materials.forEach((m) => {
      m.collection = [];
      forms.forEach((f) => {
        m.collection = m.collection.concat(f.current_materials && f.current_materials.filter((cm) => { return cm.id === m.id }));
      });
      m.quantity = 0;
      m.collection.forEach((c) => {
        m.quantity += (c && c.current_quantity) ? parseFloat(c.current_quantity) : 0;
      });
    });
  }

  ngOnInit() {
  }

  getSubcontratistas() {
    this.userService.getSubcontratistas().valueChanges().subscribe((data) => {
      this.subcontratistas = data;
      this.subcontratistas.forEach((s) => {
        s.instalaciones = this.forms.filter((f) => {return f.user && f.user.company && f.user.company.id == s.id});
      });
    }, (error) => {
      console.log(error);
    });
  }

  subcontratistaChanged(value) {
    if (this.selectedSupervisor === 'all') {
      this.calculateMaterials(this.forms);
    } else {
      this.calculateMaterials(this.selectedSupervisor.instalaciones);
    }
  }
}
