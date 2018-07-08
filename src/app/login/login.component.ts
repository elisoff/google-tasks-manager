import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {GoogleApiService, GoogleAuthService} from 'ng-gapi';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  ngOnInit() {
    this.gapiService.onLoad().subscribe();
    this.authService.getAuth().subscribe((auth) => {
      if (this.isLoggedIn()) {
        this.userService.setUser(auth.currentUser.get());
        this.router.navigate(['/dashboard']).then();
      }
    });
  }

  constructor(private userService: UserService,
              private authService: GoogleAuthService,
              private gapiService: GoogleApiService,
              private router: Router) {
  }

  public isLoggedIn(): boolean {
    return this.userService.isUserSignedIn();
  }

  public signIn() {
    this.userService.signIn();
  }

}
