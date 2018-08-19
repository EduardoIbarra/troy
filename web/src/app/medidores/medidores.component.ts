import { Component, OnInit } from '@angular/core';
import {MedidorService} from "../services/medidor.service";

@Component({
  selector: 'app-medidores',
  templateUrl: './medidores.component.html',
  styleUrls: ['./medidores.component.css']
})
export class MedidoresComponent implements OnInit {
  medidor: any = {};
  medidores: any = [];
  creating: boolean = false;
  query: string;
  constructor(private medidorService: MedidorService) {
    this.medidorService.get().valueChanges().subscribe((data) => {
      this.medidores = data;
    }, (error) => {
      console.log(error);
    });
  }

  ngOnInit() {
  }

  save() {
    if(
      !this.medidor.uid ||
      !this.medidor.rpu ||
      !this.medidor.name ||
      !this.medidor.ciudad ||
      !this.medidor.calle ||
      !this.medidor.numero ||
      !this.medidor.colonia
    ) {
      alert('Todos los campos son requeridos, favor de llenarlos');
      return;
    }
    this.medidor.timestamp = Date.now();
    this.medidorService.add(this.medidor).then((data) => {
      alert('Guardado con éxito');
      this.medidor = {};
      this.creating = false;
      console.log(data);
    }).catch((error) => {
      alert('Ocurrió un error, contactar a soporte');
      console.log(error);
    });
  }
  select(medidor) {
    this.medidor = medidor;
  }
  cancel() {
    this.medidor = {};
    this.creating = false;
  }
  remove(medidor) {
    if(!confirm('Desea eliminar este registro?')) {
      return;
    }
    this.medidorService.delete(medidor).then((data) => {
      alert('Eliminado con éxito');
    }).catch((error) => {
      alert('No se pudo eliminar, contactar a soporte');
      console.log(error);
    });
  }
}
