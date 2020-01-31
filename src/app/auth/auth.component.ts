import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, NgForm, FormGroup } from '@angular/forms';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  authForm = new FormGroup({
    userNameControl: new FormControl(),
    passwordControl: new FormControl()
  });
  private authListenerSub: Subscription;
  private token: string;
  private user;
  public userIsAuthenticated: boolean;
  userNameControl = new FormControl();
  passwordControl = new FormControl();

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.authListenerSub = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      if ( this.userIsAuthenticated === true ) {
        this.router.navigate(['/']).then( ( e: boolean ) => {
          if (e) {
            console.log('Navigation is successful!');
          } else {
            console.log('Navigation has failed!');
          }
        });
      }
    });
  }
  login(authForm) {
    console.log(authForm.controls.userNameControl.valid);
    this.authService.login(authForm);
    this.authForm.reset();
    // setTimeout(function() {
    //   that.focusOnElement();
    // }, 400);
  }

  // focusOnElement() {
  //   const el = document.getElementById('emailFocus');
  //   el.focus();
  // }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }
}
