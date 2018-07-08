import { Component } from '@angular/core';
import {GoogleApiService, GoogleAuthService} from 'ng-gapi';
import {UserService} from './user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  ready: Promise<boolean>|null = null;
  private resolve: Function|null = null;

  private shouldShowProgressBar = false;
  showProgressBar() {
    return this.shouldShowProgressBar;
  }

  constructor(private userService: UserService,
              private authService: GoogleAuthService,
              private gapiService: GoogleApiService,
              private router: Router) {

    this.ready = new Promise<boolean>((resolve) => { this.resolve = resolve; });

    this.shouldShowProgressBar = true;

    this.gapiService.onLoad().subscribe();
    this.authService.getAuth().subscribe((auth) => {
      if (this.isLoggedIn()) {
        auth.currentUser.get().reloadAuthResponse().then((newAuth) => {
          this.userService.setToken(newAuth.access_token);
          this.userService.setUser(auth.currentUser.get());
          this.resolve !(true);
        });
      } else {
        this.resolve !(true);
        router.navigate(['/login']);
      }

      this.shouldShowProgressBar = false;
    });
  }

  public isLoggedIn(): boolean {
    return this.userService.isUserSignedIn();
  }
}
