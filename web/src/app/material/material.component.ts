import {Component, OnInit} from '@angular/core';
import {FormService} from "../services/form.service";
import {UserService} from "../services/user.service";
import {FallidaService} from "../services/fallida.service";
import {MaterialService} from "../services/material.service";
import {NgxSpinnerService} from "ngx-spinner";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']
})
export class MaterialComponent implements OnInit {
  forms: any[] = [];
  varillas: any[] = [];
  fallidas: any[] = [];
  subcontratistas: any[] = [];
  usuarios: any[] = [];
  materials: any[] = [];
  selectedSupervisor: any;
  userSubscription: any;
  user: any;

  constructor(private formService: FormService,
              private userService: UserService,
              private fallidaService: FallidaService,
              private authService: AuthService,
              private spinnerService: NgxSpinnerService,
              private materialService: MaterialService) {
    this.spinnerService.show();

    this.authService.getStatus().subscribe((data) => {
      if (!data) {
        return;
      }
      this.userSubscription = this.userService.getById(data.uid).valueChanges().subscribe((data) => {
        this.user = data;
        this.userSubscription.unsubscribe();
      }, (error) => {
        console.log(error);
      });
    }, (error) => {
      console.log(error);
    });
  }

  ngOnInit() {
    this.materialService.totals().valueChanges().subscribe((data) => {
      console.log('Materiales',data);
      this.materials = data;
      this.getSubcontratistas();
    })
  }

  getSubcontratistas() {
    const subscription = this.userService.getSubcontratistas().valueChanges().subscribe((data) => {
      this.subcontratistas = data;
      this.subcontratistas.forEach((s) => {
        this.materialService.totalBySubcontratista(s.id).valueChanges().subscribe((totals) => {
          s.instalaciones = totals;
        });
      });

      console.log('Subcontratista',this.subcontratistas);
      this.spinnerService.hide();
      subscription.unsubscribe();
    }, (error) => {
      console.log(error);
    });
  }

  subcontratistaChanged(value) {
    console.log(value);
    if (this.selectedSupervisor === 'all') {
      this.materialService.totals().valueChanges().subscribe((data) => {
        this.materials = data;
      })
    } else {
      this.materialService.totalBySubcontratista(value).valueChanges().subscribe((totals) => {
        this.materials = totals;
      });
    }
  }
}
