import { Component, OnInit } from '@angular/core';
import {FallidaService} from "../services/fallida.service";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-fallidas',
  templateUrl: './fallidas.component.html',
  styleUrls: ['./fallidas.component.scss']
})
export class FallidasComponent implements OnInit {

  fallida: any = {};
  fallidas: any = [];
  creating: boolean = false;
  query: string;
  constructor(private fallidaService: FallidaService, private authService: AuthService) {
    this.fallidaService.get().valueChanges().subscribe((data) => {
      this.fallidas = data;
      this.fallidas.forEach((f) => {
        f.visitas = Object.values(f.visitas);
      });
      console.log(data);
    }, (error) => {
      console.log(error);
    });
  }

  ngOnInit() {
  }

  select(fallida) {
    this.fallida = fallida;
  }
  cancel() {
    this.fallida = {};
    this.creating = false;
  }
  remove(fallida) {
    if(!confirm('Desea eliminar este registro?')) {
      return;
    }
    this.fallidaService.delete(fallida).then((data) => {
      alert('Eliminado con éxito');
    }).catch((error) => {
      alert('No se pudo eliminar, contactar a soporte');
      console.log(error);
    });
  }
}
