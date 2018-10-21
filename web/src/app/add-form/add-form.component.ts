import {Component, OnInit, ViewChild} from '@angular/core';
import {FormService} from "../services/form.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MedidorService} from "../services/medidor.service";
import {DomSanitizer} from "@angular/platform-browser";
import {UserService} from "../services/user.service";
import {MaterialService} from "../services/material.service";
import {AuthService} from "../services/auth.service";
import {GeneralService} from "../services/general.service";
import {SignaturePad} from "angular2-signaturepad/signature-pad";

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.css']
})
export class AddFormComponent implements OnInit {
  today = Date.now();
  step = 1;
  form: any = {};
  materials:any [] = [];
  current_materials:any [] = [];
  current_material: any;
  current_quantity: any;
  last_step = 6;
  map: any;
  coords: any;
  pictures: any[] = [];
  user: any;
  showing = false;
  employees:any[] = [];
  firmaCFE:string;
  firmaTroy:string;
  supervisores:any[] = [];
  imageChangedEvent: any = '';
  croppedImage: any = '';
  picture: any;
  @ViewChild(SignaturePad) public signaturePad: SignaturePad;
  public signaturePadOptions: Object = {
    'minWidth': 2,
    'canvasWidth': 340,
    'canvasHeight': 200
  };
  public signatureImage: string;
  offline_forms: any [] = [];
  constructor(private formService: FormService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private medidorService: MedidorService,
              public sanitizer: DomSanitizer,
              public userService: UserService,
              private authService: AuthService,
              private materialService: MaterialService,
              private generalService: GeneralService) {
    this.authService.getStatus().subscribe((data) => {
      this.userService.getById(data.uid).valueChanges().subscribe((user) => {
        this.form.user = user;
      }, (error) => {
        console.log(error);
      });
    }, (error) => {
      console.log(error);
    });
    this.userService.getSubcontratistas().valueChanges().subscribe((data) => {
      this.employees = data;
      console.log(this.employees);
    }, (error) => {
      console.log(error);
    });
    this.userService.getSupervisors().on('value', (data) => {
      this.supervisores = [];
      data.forEach((data) => {
        const supervisor = data.val();
        this.supervisores.push({
          name: supervisor.name,
          last_name: supervisor.last_name,
          uid: supervisor.uid,
          tipo: supervisor.tipo
        });
      });
      console.log(this.supervisores);
    });
    this.materialService.get().valueChanges().subscribe((data) => {
      this.form.current_materials = data;
    }, (error) => {
      console.log(error);
    });
  }
  ngOnInit() { }
  previous() {
    this.step--;
  }
  next() {
    if (this.step === 1 && (!this.form.serie || this.form.serie.length < 9)) {
      alert('Debe ingresar un número de serie de optimizador mayor a 9 dígitos');
      return;
    }
    if (this.step === 2 && !this.form.medidor) {
      alert('Debe ingresar un número de medidor para continuar');
      return;
    }
    this.step++;
    console.log(this.form);
    if(this.step == 4) {
      window.setTimeout(() => {
        // this.loadMap();
      }, 400)
    }
    if(this.step == 6) {
      window.setTimeout(() => {
        this.signaturePad.clear();
        this.canvasResize();
      }, 800)
    }
  }
  canvasResize() {
    let canvas = document.querySelector('canvas');
    this.signaturePad.set('minWidth', 1);
    this.signaturePad.set('canvasWidth', canvas.offsetWidth);
    this.signaturePad.set('canvasHeight', canvas.offsetHeight);
  }
  drawClear() {
    this.signaturePad.clear();
  }
  getFirmaTroy() {
    this.firmaTroy = JSON.parse(JSON.stringify(this.signaturePad.toDataURL()));
    this.drawClear();
  }
  getFirmaCFE() {
    this.firmaCFE = JSON.parse(JSON.stringify(this.signaturePad.toDataURL()));
    this.drawClear();
  }
  finish() {
    this.form.uid = Date.now();
    this.formService.add(this.form).then((data) => {
      this.uploadPictures(this.form.uid);
      alert('Guardado con éxito');
      this.router.navigate(['/home']);
    }).catch((error) => {
      alert('Ocurrió un error mientras se enviaba el formulario:  ' + JSON.stringify(error));
      console.log(error);
    });
  }
  searchMedidor() {
    this.medidorService.getById(this.form.medidor).valueChanges().subscribe((data: any) => {
      if(data) {
        this.form.nombre = data.nombre;
        this.form.calle = data.Direccion;
        this.form.colonia = data.colonia;
        this.form.ciudad = data.municipio + ', ' + data.estado;
        this.form.rpu = data.rpu;
        this.form.geolocation = {lat: data.lat.slice(0, 2) + "." + data.lat.slice(2), lng: data.lng.slice(0, 4) + "." + data.lng.slice(4)};
        console.log(data);
      }else {
        alert('Medidor no encontrado');
      }
    }, (error) => {
      console.log(error);
    });
  }
  fileChangeEvent($event: any): void {
    this.readThis($event.target);
  }
  readThis(inputValue: any): void {
    var file:File = inputValue.files[0];
    var myReader:FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.picture = myReader.result;
      this.pictures.push(this.picture);
      console.log(this.picture);
    };
    myReader.readAsDataURL(file);
  }
  uploadPictures(formUid) {
    if (this.firmaCFE) {
      const firmaCFEId = Date.now();
      this.generalService.uploadPicture('firmas/cfe/' + firmaCFEId + '.jpg', this.firmaCFE).then(() => {
        this.generalService.getDownloadURL('firmas/cfe/' + firmaCFEId + '.jpg').subscribe((url) => {
          console.log('forms/' + formUid + '/firmaCFE', url);
          this.generalService.freeUpdate('forms/' + formUid + '/firmaCFE', url);
        });
      }).catch(() => {
        console.log('Falla al subir la FirmaCFE');
      });
    }
    if (this.firmaTroy) {
      const firmaTroyId = Date.now();
      this.generalService.uploadPicture('firmas/troy/' + firmaTroyId + '.jpg', this.firmaTroy).then(() => {
        this.generalService.getDownloadURL('firmas/troy/' + firmaTroyId + '.jpg').subscribe((url) => {
          console.log('forms/' + formUid + '/firmaTroy', url);
          this.generalService.freeUpdate('forms/' + formUid + '/firmaTroy', url);
        });
      }).catch(() => {
        console.log('Falla al subir la FirmaTroy');
      });
    }

    if (this.pictures && this.pictures.length > 0) {
      this.pictures.forEach((picture) => {
        const thisPictureId = Date.now();
        this.generalService.uploadPicture('instalaciones/' + thisPictureId + '.jpg', picture).then(() => {
          this.generalService.getDownloadURL('instalaciones/' + thisPictureId + '.jpg').subscribe((url) => {
            this.generalService.freeUpdate('forms/' + formUid + '/pictures/' + thisPictureId, url);
          });
        }).catch(() => {
          console.log('Falla al subir fotografía');
        });
      })
    }
  }
}
