import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit{
  constructor (private authService: AuthService) {}
  ngOnInit() {
    this.authService.autoAuthUser();
  }

}
