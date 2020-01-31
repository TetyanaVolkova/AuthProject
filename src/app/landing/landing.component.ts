import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AppService } from '../app.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnDestroy {
  private countSub: Subscription;
  private ticketsSub: Subscription;
  public crssNumber: any;
  public activeTickets: any;
  approvedTickets: any;
  allTickets: any;

  constructor( private appService: AppService,
               private cd: ChangeDetectorRef ) {
  }

  ngOnInit() {
    this.appService.getCrss('all', '0', '');
    this.appService.getTickets('all', '0', '');
    this.countSub = this.appService.getCountUpdateListener()
    .subscribe((count) => {
      this.crssNumber = count;
      this.cd.markForCheck();
    });
    this.ticketsSub = this.appService.getTicketsUpdateListener()
    .subscribe((tickets: Array<any> ) => {
      let activeCounter = 0;
      let approvedCounter = 0;
      tickets.forEach( ticket => {
        if ( ticket.ticket_stage === "active" ) {
          activeCounter++;
        }
        if( ticket.ticket_stage === "inProcess approved" ) {
          approvedCounter++;
        }
      })
      this.activeTickets = activeCounter;
      this.approvedTickets = approvedCounter;
      this.allTickets = tickets.length;
    });
  }

  goToCRS() {
    window.location.href = 'https://node.sitecatalog.org';
  }

  ngOnDestroy() {
    this.countSub.unsubscribe();
    this.ticketsSub.unsubscribe();
  }

}
