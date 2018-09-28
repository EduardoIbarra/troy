import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  operation: string = 'login';
  email: string = null;
  password: string = null;
  name: string = null;
  constructor(private authService: AuthService, private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.authService.loginWithEmail(this.email, this.password).then( (data) => {
      this.authService.getStatus().subscribe((status) => {
        this.userService.getById(status.uid).valueChanges().subscribe((user:any) => {
          if(user.admin) {
            console.log(data);
            this.router.navigate(['reports']);
          } else {
            alert('Usted no tiene acceso al administrador web');
          }
        }, (error) => {
          console.log(error);
        });
      }, (error) => {
        console.log(error);
      });
    }).catch((error) => {
      alert('Ocurrioo un error');
      console.log(error);
    });
  }

  register() {
    this.authService.registerWithEmail(this.email, this.password).then( (data) => {
      const user = {
        uid: data.user.uid,
        email: this.email,
        name: this.name
      };
      this.userService.add(user).then((data2) => {
        alert('Registrado correctamente');
        console.log(data2);
      }).catch((error) => {
        alert('Ocurrioo un error');
        console.log(error);
      });
    }).catch((error) => {
      alert('Ocurrioo un error');
      console.log(error);
    });
  }
}
