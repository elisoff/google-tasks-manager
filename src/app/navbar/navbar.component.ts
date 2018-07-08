import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  avatarPic = '';

  constructor(private userService: UserService,
              private router: Router) { }

  ngOnInit() {
    const userProfile = this.userService.getCurrentUser().getBasicProfile();
    this.setAvatar(userProfile);
  }

  private setAvatar(userProfile) {
    this.avatarPic = userProfile.getImageUrl();
  }

  public signOut() {
    this.userService.signOut();
    this.router.navigate(['/login']).then();
  }

  public addTask() {
    this.router.navigate(['/new/task']).then();
  }
}
