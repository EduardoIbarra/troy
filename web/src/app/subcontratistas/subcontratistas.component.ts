import { Component, OnInit } from '@angular/core';
import {SubcontratistaService} from "../services/subcontratista.service";

@Component({
  selector: 'app-subcontratistas',
  templateUrl: './subcontratistas.component.html',
  styleUrls: ['./subcontratistas.component.css']
})
export class SubcontratistasComponent implements OnInit {
  subcontratista: any = {};
  subcontratistas: any = [];
  creating: boolean = false;
  query: string;
  constructor(private subcontratistaService: SubcontratistaService) {
    this.subcontratistaService.get().valueChanges().subscribe((data) => {
      this.subcontratistas = data;
    }, (error) => {
      console.log(error);
    });
  }

  ngOnInit() {
  }

  save() {
    if(
      !this.subcontratista.nombre ||
      !this.subcontratista.ciudad
    ) {
      alert('Todos los campos son requeridos, favor de llenarlos');
      return;
    }
    this.subcontratista.id = (this.subcontratista.id) ? this.subcontratista.id : Date.now();
    this.subcontratistaService.add(this.subcontratista).then((data) => {
      alert('Guardado con éxito');
      this.subcontratista = {};
      this.creating = false;
      console.log(data);
    }).catch((error) => {
      alert('Ocurrió un error, contactar a soporte');
      console.log(error);
    });
  }
  select(subcontratista) {
    this.subcontratista = subcontratista;
  }
  cancel() {
    this.subcontratista = {};
    this.creating = false;
  }
  remove(subcontratista) {
    if(!confirm('Desea eliminar este registro?')) {
      return;
    }
    this.subcontratistaService.delete(subcontratista).then((data) => {
      alert('Eliminado con éxito');
    }).catch((error) => {
      alert('No se pudo eliminar, contactar a soporte');
      console.log(error);
    });
  }
}
