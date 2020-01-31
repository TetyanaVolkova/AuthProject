import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AppService } from '../app.service';
import { formatDate } from '@angular/common';
import { HistoryService } from '../../app/history/history.service';
// import { moment } from 'moment/src/moment';
// const moment = require('moment');

@Injectable({ providedIn: 'root' })

export class LaboratoryService {
  private labs;
  private lab_id;
  private ticketsUpdated = new Subject();
  private date = new Date();
  public toggleTarget = new Subject();
  private toggleTar;

  constructor(private http: HttpClient,
              private appService: AppService,
              public historyService: HistoryService) {
    this.toggleTargetUpdateListener()
    .subscribe((val) => {
      this.toggleTar = val;
    });
    // this.toggleTar = true;
    // this.toggleTarget.next(this.toggleTar);
    // console.log(this.toggleTar);
  }

  toggleTargetUpdateListener() {
    return this.toggleTarget.asObservable();
  }
  onOpen( event, open ) {
    if ( this.toggleTar === true ) {
      console.log(event.currentTarget.parentElement.parentElement);
      event.currentTarget.parentElement.parentElement.classList.add('lab_is_open');
    } else {
      const element = document.getElementsByClassName('lab_is_open')[0];
      console.log(document.getElementsByClassName('lab_is_open')[0]);
      element.classList.remove('lab_is_open');
    }
    this.toggleTar = !this.toggleTar;
    this.toggleTarget.next(this.toggleTar);
    open.expanded = !open.expanded;
    this.appService.getOpenAccordion.next(open.expanded);
    this.historyService.ticketArray = [];
    this.historyService.onOpen( open.lab_id );
  }
}
