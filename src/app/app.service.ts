import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../environments/environment';


@Injectable({ providedIn: 'root' })

export class AppService {
  private crss;
  public tickets;
  public crssUpdated = new Subject();
  public countUpdated = new Subject();
  public countForTickets = new Subject();
  public ticketsUpdated = new Subject();
  public laboratoryListUpdated = new Subject();
  public getOpenAccordion = new Subject();
  private date = new Date();
  private ticketSub;
  private reg_id;
  private lab_id;
  private count;
  private newId;
  private laboratoryList;
  private ticketsCount;

  private BACKEND_URL = environment.BACKEND_URL;

  constructor(private http: HttpClient) {
  }

  getTickets( limit: string, pageIndex: string, searchString: string ) {
    const data = {
      limit: limit || '5',
      pageIndex: pageIndex || '0',
      searchString: searchString
     };
    const config = {
    params: data
    };
    this.http
      .get<{ message: string; tickets: {}, responseType: 'text' }>
      ( this.BACKEND_URL + '/api/tickets_list', config )
      .subscribe(postData => {
        this.tickets = postData[0];
        this.newId = +postData[1];
        this.ticketsCount = +postData[2] + 1;
        this.countForTickets.next( [this.newId, this.ticketsCount] );
        this.ticketsUpdated.next([...this.tickets]);
      });
  }
  getCrss( limit: string, pageIndex: string, searchString: string ) {
    const data = {
      limit: limit || '5',
      pageIndex: pageIndex || '0',
      searchString: searchString
     };
    const config = {
    params: data
    };
    this.http
      .get<{ message: string; crss: {}, responseType: 'text' }>(
        this.BACKEND_URL + '/api/crs_list', config)
      .subscribe(postData => {
        this.crss = postData[0];
        this.count = postData[1];
        this.laboratoryList = postData[2];
        this.crssUpdated.next([...this.crss]);
        this.countUpdated.next(this.count);
        this.laboratoryListUpdated.next(this.laboratoryList);
      });
  }
  addPost(
    labID: number,
    crs_id: number,
    ticket_atr: string,
    ticket_old_value: string,
    ticket_new_value: string,
    lab_reg: string,
    status: string
  ) {
    this.getOpenAccordion.next(true);
    const id = Number(labID);
      if ( lab_reg === 'laboratory') {
        this.reg_id = null;
        this.lab_id = labID;
      } else if ( lab_reg === 'regulatory' ) {
        this.reg_id = labID;
        this.lab_id = null;
      }
      const ticket = {
                        crs_id: crs_id,
                        ticket_date: this.date,
                        ticket_status: status,
                        ticket_stage: 'active',
                        ticket_email: 'email@email.com',
                        ticket_fullname: 'Full Name Here',
                        lab_reg: lab_reg,
                        reg_id: this.reg_id,
                        lab_id: this.lab_id,
                        ticket_atr: ticket_atr,
                        ticket_old_value: ticket_old_value,
                        ticket_new_value: ticket_new_value
                      };
      this.countForTickets.next([this.newId, this.ticketsCount + 1]);
      this.http
        .post( this.BACKEND_URL + '/api/tickets_list', ticket )
        .subscribe(responseData => {
          this.tickets.push(responseData);
          this.ticketsUpdated.next([...this.tickets]);
          return;
        });
  }
  deleteLab(id, crs_id, lab_reg) {
    setTimeout(() => {
      if ( lab_reg === 'laboratory') {
        this.reg_id = null;
        this.lab_id = id;
      } else if ( lab_reg === 'regulatory' ) {
        this.reg_id = id;
        this.lab_id = null;
      }
      const ticket = { ticket_id: this.ticketsCount,
                      crs_id: crs_id,
                      ticket_date: this.date,
                      ticket_status: 'deleted',
                      ticket_stage: 'active',
                      ticket_email: 'email@email.com',
                      ticket_fullname: 'Some Name',
                      lab_reg: lab_reg,
                      reg_id: this.reg_id,
                      lab_id: this.lab_id,
                      ticket_atr: '',
                      ticket_old_value: '',
                      ticket_new_value: ''
                    };
      this.countForTickets.next([this.newId, this.ticketsCount + 1]);
      this.http
        .post(this.BACKEND_URL + '/api/tickets_list', ticket)
        .subscribe(responseData => {
          this.tickets.push(responseData);
          this.ticketsUpdated.next([...this.tickets]);
        });
    }, 1000 );
  }
  approveReject(id, status) {
    let newTicket = <any>{};
    this.tickets.forEach(element => {
      if ( element.ticket_id === id ) {
        console.log(element);
        newTicket = {...element};
        element.ticket_stage = 'archived ' + status;
        const newElement = element;
        this.http
          .put( this.BACKEND_URL + '/api/tickets_list/' + +id, newElement )
          .subscribe(responseData => {
            console.log(responseData);
          });
      }
    });
    newTicket.ticket_date = new Date();
    newTicket.ticket_email = 'Pull new email';
    newTicket.ticket_fullname = 'Pull new name';
    newTicket.ticket_id = this.ticketsCount;
    this.countForTickets.next([this.newId, this.ticketsCount + 1]);
    newTicket.ticket_stage = 'inProcess ' + status;
    this.http
      .post(this.BACKEND_URL + '/api/tickets_list', newTicket)
      .subscribe(responseData => {
        this.tickets.unshift(responseData);
        this.ticketsUpdated.next([...this.tickets]);
      });
  }
  getCrsUpdateListener() {
    return this.crssUpdated.asObservable();
  }
  getOpenAccordionListener() {
    return this.getOpenAccordion.asObservable();
  }
  getCountUpdateListener() {
    return this.countUpdated.asObservable();
  }
  getTicketCountUpdateListener() {
    return this.countForTickets.asObservable();
  }
  getTicketsUpdateListener() {
    return this.ticketsUpdated.asObservable();
  }
  laboratoryListUpdatedListener() {
    return this.laboratoryListUpdated.asObservable();
  }
}
