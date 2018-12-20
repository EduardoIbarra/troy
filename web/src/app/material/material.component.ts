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
      console.log('Materiales', data);
      this.materials = data;
      this.getSubcontratistas();
    })
  }

  getSubcontratistas() {
    const subscription = this.userService.getSubcontratistas().valueChanges().subscribe((data) => {
      this.subcontratistas = data;
      this.subcontratistas.forEach((s) => {
        this.materialService.totalBySubcontratista(s.id).valueChanges().subscribe((totals) => {
          s.materiales = totals;
        });
      });

      console.log('Subcontratista', this.subcontratistas);
      this.spinnerService.hide();
      subscription.unsubscribe();
    }, (error) => {
      console.log(error);
    });
  }

  subcontratistaChanged(value) {
    if (this.selectedSupervisor === 'all') {
      this.materialService.totals().valueChanges().subscribe((data) => {
        console.log('Materiales', data);
        this.materials = data;
      })
    } else {
      this.materialService.totalBySubcontratista(value).valueChanges().subscribe((totals) => {
        this.materials = totals;
      });
    }
  }


  setTotalAllSubcontratistas() {
    const formService = this.formService.get().valueChanges().subscribe((forms: any) => {

      let totales: any[] = [];
      let materiales: any[] = [];

      forms.map((form: any) => {
        if (!form || !form.current_materials) return;

        let subId;
        if (form.instalo) {
          subId = form.instalo.id;
        } else if (form.user && form.user.company) {
          subId = form.user.company.id;
        }

        if (!subId) return;

        if (!totales[subId]) {
          totales[subId] = []
        }


        form.current_materials.map((mat) => {
          // mat = {id, current_quantity, unidad, descripcion}
          if (mat.current_quantity === "" || mat.current_quantity === undefined) return;

          if (!materiales[subId]) {
            materiales[subId] = [];
          }
          materiales[subId].push(mat);

          materiales[subId].map((m, i) => {
            if (m.id === mat.id) {
              if (!totales[subId][m.id]) {
                totales[subId][m.id] = {
                  id: m.id,
                  total: parseFloat(m.current_quantity),
                  unidad: m.unidad,
                  descripcion: m.descripcion,
                  sub: subId
                }
              } else {
                totales[subId][m.id].total += parseFloat(m.current_quantity)
              }
            }
            materiales[subId] = materiales[subId].slice(i, 1);
          });
        })

      });


      totales.map((sub) => {
        sub.map((mat) => {
          if (mat.total === "" || mat.total === undefined) return;

          const totalService = this.materialService.totalBySubcontratistaMat(mat.sub, mat.id).valueChanges().subscribe((snap: any) => {
            let newValue = {
              id: mat.id,
              total: parseFloat(mat.total),
              unidad: mat.unidad,
              descripcion: mat.descripcion
            };

            if (snap) {
              newValue.total += parseFloat(snap.total);
            }

            this.materialService.settotalBySubcontratistaMat(mat.sub, mat.id, newValue);
            totalService.unsubscribe();
          })
        })
      });


      console.log('Totales', totales);
      console.log('Total formularios', forms.length);

      this.spinnerService.hide();
      formService.unsubscribe()

    });
  }
}
