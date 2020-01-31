import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated: Boolean;
  private authListenerSub: Subscription;
  private tokenListenerSub: Subscription;
  private token;

  constructor(  private authService: AuthService,
                private cd: ChangeDetectorRef
              ) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.cd.markForCheck();
    });
    this.tokenListenerSub = this.authService
    .getTokenListener()
    .subscribe(token => {
      this.token = token;
    });
  }
  logOut() {
    this.authService.logout();
  }
  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
    this.tokenListenerSub.unsubscribe();
  }
}
