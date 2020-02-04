import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Inject } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-register-component',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    registerForm = new FormGroup({
      firstNameControl: new FormControl(),
      lastNameControl: new FormControl(),
      userNameControl: new FormControl(),
      passwordControl: new FormControl(),
      confirmPasswordControl: new FormControl()
    });
  private secretKey = environment.SECRET_KEY;
  private BACKEND_URL = environment.BACKEND_URL;
  private user = {
    auth_fullname: '',
    auth_email: '',
    auth_password: ''
  };
  private fullName;
  public email_exist = false;

  constructor( private http: HttpClient,
               private router: Router) { }

  ngOnInit() {
  }
  register() {
    if ( this.registerForm.value.passwordControl !== this.registerForm.value.confirmPasswordControl ) {
      // this.registerForm.value.passwordControl = '';
      // this.registerForm.value.confirmPasswordControl = '';
      return;
    }
    this.fullName = this.registerForm.value.firstNameControl + ' ' + this.registerForm.value.lastNameControl;
    const password = this.registerForm.value.passwordControl;
    const keyutf = CryptoJS.enc.Utf8.parse(this.secretKey);
    const iv = CryptoJS.enc.Base64.parse(this.secretKey);
    const enc = CryptoJS.AES.encrypt(password, keyutf, { iv: iv });
    const encStr = enc.toString();
    this.user = {
      auth_fullname: this.fullName,
      auth_email: this.registerForm.value.userNameControl,
      auth_password: encStr
    };
    this.http
      .post( this.BACKEND_URL + '/register',
       this.user )
      .subscribe(responseData => {
        if ( responseData === 'Email already registered') {
          this.email_exist = true;
        } else {
          this.email_exist = false;
          this.router.navigate(['/login']).then( ( e: boolean ) => {
            if (e) {
              console.log('Navigation is successful!');
            } else {
              console.log('Navigation has failed!');
            }
          });
        }
        return;
      });
      this.registerForm.reset();
      // const that = this;
      // setTimeout(function() {
      //   that.focusOnElement();
      // }, 800);
  }
  // focusOnElement() {
  //   const el = document.getElementById('focus');
  //   el.focus();
  // }

}
