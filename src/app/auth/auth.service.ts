import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
declare var require: any;

import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })

export class AuthService {
  private token: string;
  private isAuthenticated = false;
  authStatusListener = new Subject<boolean>();
  tokenListener = new Subject();
  private tokenTimer: any;
  private BACKEND_URL = environment.BACKEND_URL;

  constructor( private http: HttpClient,
               private router: Router ) {
  }
  getToken() {
    return this.token;
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getTokenListener() {
    return this.tokenListener.asObservable();
  }
  login(authForm) {
    console.log(authForm.value);

    this.http
      .post<{token: string, expiresIn: Number}>( this.BACKEND_URL + '/login', authForm.value )
      .subscribe(responseData => {
        const token = responseData.token;
        this.token = responseData.token;
        this.tokenListener.next(token);
        if (!token) {
          this.authStatusListener.next(false);
        } else {
          const expiresInDuration = responseData.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now =new Date();
          const expiresDuration = new Date(now.getTime() + +expiresInDuration * 1000);
          this.saveAuthData(token, expiresDuration);
        }
      });
  }
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.authStatusListener.next(true); 
      this.setAuthTimer(expiresIn / 1000);
    }
  }
  setAuthTimer(duration: Number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, +duration * 1000);
  }
  logout() {
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.token = null;
    this.tokenListener.next(null);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }
  saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
  }
  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
  }
  getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }
}
