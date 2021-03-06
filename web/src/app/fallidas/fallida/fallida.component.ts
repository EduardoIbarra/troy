import { Component, OnInit } from '@angular/core';
import {FallidaService} from "../../services/fallida.service";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-fallida',
  templateUrl: './fallida.component.html',
  styleUrls: ['./fallida.component.scss']
})
export class FallidaComponent implements OnInit {
  fallida: any;
  constructor(private fallidaService: FallidaService, private activatedRoute: ActivatedRoute, public sanitizer: DomSanitizer) {
    this.fallidaService.getById(this.activatedRoute.snapshot.params['medidor']).valueChanges().subscribe((data) => {
      this.fallida = data;
      this.fallida.visitas = Object.values(this.fallida.visitas);
      this.fallida.visitas.forEach((v) => {
        if (v.pictures) {
          v.pictures = Object.values(v.pictures);
        }
      });
      console.log(this.fallida);
    }, (error) => {
      console.log(error);
    });
  }

  ngOnInit() {
  }
}
