import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user.service";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  usuario: any = {};
  usuarios: any[] = [];
  creating: boolean = false;
  query: string;
  subcontratistas: any[] = [];
  constructor(private usuarioService: UserService, private authService: AuthService) {
    this.usuarioService.get().valueChanges().subscribe((data) => {
      this.usuarios = data;
    }, (error) => {
      console.log(error);
    });
    this.usuarioService.getSubcontratistas().valueChanges().subscribe((data) => {
      this.subcontratistas = data;
    }, (error) => {
      console.log(error);
    });
  }

  ngOnInit() {
  }

  save() {
    if(
      !this.usuario.name ||
      !this.usuario.last_name ||
      !this.usuario.address ||
      !this.usuario.email ||
      !this.usuario.password ||
      !this.usuario.repeat ||
      !this.usuario.telefono ||
      !this.usuario.imss ||
      !this.usuario.is_supervisor ||
      !this.usuario.tipo
    ) {
      alert('Todos los campos son requeridos, favor de llenarlos');
      return;
    }
    if (this.usuario.password  !== this.usuario.repeat) {
      alert('Las contraseñas deben coincidir');
      return;
    }
    this.usuario.timestamp = Date.now();
    if(this.creating) {
      this.authService.registerWithEmail(this.usuario.email, this.usuario.password).then( (data) => {
        this.usuario.uid = data.user.uid;
        this.usuarioService.add(this.usuario).then((data) => {
          alert('Guardado con éxito');
          this.usuario = {};
          this.creating = false;
          console.log(data);
        }).catch((error) => {
          alert('Ocurrió un error, contactar a soporte');
          console.log(error);
        });
      }).catch((error) => {
        alert('Ocurrió un error, contactar a soporte: ' + error.message);
        console.log(error);
      });
    } else {
      this.usuarioService.add(this.usuario).then((data) => {
        alert('Guardado con éxito');
        this.usuario = {};
        this.creating = false;
        console.log(data);
      }).catch((error) => {
        alert('Ocurrió un error, contactar a soporte');
        console.log(error);
      });
    }
  }
  select(usuario) {
    this.usuario = usuario;
  }
  cancel() {
    this.usuario = {};
    this.creating = false;
  }
  remove(usuario) {
    if(!confirm('Desea eliminar este registro?')) {
      return;
    }
    this.usuarioService.delete(usuario).then((data) => {
      alert('Eliminado con éxito');
    }).catch((error) => {
      alert('No se pudo eliminar, contactar a soporte');
      console.log(error);
    });
  }
  reset(usuario) {
    if (!confirm('Seguro que deseas enviar el m;email para cambiar el password de ' + usuario.name + '?')) {
      return;
    }
    this.authService.resetPassword(usuario.email).then((data) => {
      alert('Email para cambiar password enviado con éxito');
    }).catch((error) => {
      console.log(error);
    });
  }
}
