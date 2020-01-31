import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
declare var require: any;
const moment = require('moment');

import { AppService } from '../app.service';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })

export class HistoryService {
  private ticketsUpdated = new Subject();
  private history;
  public ticketArray;
  private historySub;
  private BACKEND_URL = environment.BACKEND_URL;

  constructor( private http: HttpClient,
               private appService: AppService ) {
  }
  onOpen( id ) {
    const that = this;
    if (this.history) {
      this.history.forEach(element => {
        if ( element.lab_id === id || element.reg_id === id ) {
          element.ticket_date =  moment( element.ticket_date ).format( 'MMMM DD, YYYY' );
          that.ticketArray.push(element);
        }
      });
    } else { this.history = []; }
  }
}
