import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "./services/auth.service";
import {UserService} from "./services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: any;
  constructor(public router: Router, public authService: AuthService, private userService: UserService) {
    this.authService.getStatus().subscribe((data) => {
      if (!data) { return; }
      this.userService.getById(data.uid).valueChanges().subscribe((data) => {
        this.user = data;
        console.log(this.user);
      }, (error) => {
        console.log(error);
      });
    }, (error) => {
      console.log(error);
    });
  }
  logout() {
    if (!confirm('Seguro que desea cerrar sesión?')) { return; }
    this.authService.logOut().then((data) => {
      this.router.navigate(['login']);
    }).catch((error) => {
      console.log(error);
    });
  }
}
