import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from '../../app.service';
import { SearchService } from '../../search-component/search.service';
import { HistoryService } from '../history.service';
import { PageEvent } from '@angular/material/paginator';
import { LaboratoryService } from '../../../app/laboratories/laboratory.service';
declare var require: any;
const moment = require('moment');

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements OnInit, OnDestroy {
  public history;
  private historySub: Subscription;
  private toggleTargetSub: Subscription;
  private searchSub: Subscription;
  private searchString = '';
  public totalTickets: any;
  private countSub: Subscription;
  public pageIndex = '0';
  public pageSize = '10';
  public pageSizeOptions = [ 5, 10, 20 ];
  public limit;
  private toggleTarget = true;

  constructor ( public appService: AppService,
                private cd: ChangeDetectorRef,
                private searchService: SearchService,
                private historyService: HistoryService,
                private laboratoryService: LaboratoryService ) {}

  ngOnInit() {
    this.appService.getTickets( this.pageSize, this.pageIndex, this.searchString );
     this.historySub = this.appService.getTicketsUpdateListener()
       .subscribe((history) => {
         console.log(history);
         this.history = history;
         this.history.forEach(element => {
           element.ticket_date = moment( element.ticket_date ).format( 'MMMM DD, YYYY' );
         });
         this.cd.markForCheck();
       });
    this.laboratoryService.toggleTarget.next(this.toggleTarget);
    this.toggleTargetSub = this.laboratoryService.toggleTargetUpdateListener()
    .subscribe( ( target ) => {
      console.log(target);
      this.toggleTarget = <boolean>target;
    });
    this.searchSub = this.searchService.getSearchUpdateListener()
      .subscribe((searchString) => {
        this.searchString = searchString.toString();
        this.pageIndex = '0';
        this.appService.getTickets( this.pageSize, this.pageIndex, this.searchString );
      });
    this.countSub = this.appService.getTicketCountUpdateListener()
      .subscribe((count) => {
        this.totalTickets = count[0];
      });
  }

  mergeToDB(ticket) {
    const element = document.getElementsByClassName('lab_is_open')[0];
    console.log(document.getElementsByClassName('lab_is_open')[0]);
    element.classList.remove('lab_is_open');
    ticket.expanded = !ticket.expanded;
    this.toggleTarget = !this.toggleTarget;
    this.laboratoryService.toggleTarget.next(this.toggleTarget);
    alert('ARE YOU SURE?');
    console.log('MERGED!!!');
  }

  sendEmail(ticket) {
    const element = document.getElementsByClassName('lab_is_open')[0];
    console.log(document.getElementsByClassName('lab_is_open')[0]);
    element.classList.remove('lab_is_open');
    ticket.expanded = !ticket.expanded;
    this.toggleTarget = !this.toggleTarget;
    this.laboratoryService.toggleTarget.next(this.toggleTarget);
    console.log('SEND EMAIL!!!');
  }

  ngOnDestroy() {
    this.historySub.unsubscribe();
    this.searchSub.unsubscribe();
    this.countSub.unsubscribe();
    this.toggleTargetSub.unsubscribe();
  }

  onPageChange(pageData: PageEvent) {
    this.pageSize = pageData.pageSize.toString();
    this.pageIndex = pageData.pageIndex.toString();
    this.limit = pageData.pageSize.toString();
    this.appService.getTickets( this.pageSize, this.pageIndex, this.searchString );
  }

  // deleteLab(id: number) {
  //   console.log(id);
  //   this.historyService.deleteLab(id);
  // }

  onOpen ( event, ticket ) {
    this.laboratoryService.onOpen( event, ticket );
  }

  // closeAccordion(event, ticket) {
  //   ticket.expanded = !ticket.expanded;
  // }

  approveReject(ticket: any, status: string) {
    const element = document.getElementsByClassName('lab_is_open')[0];
    element.classList.remove('lab_is_open');
    ticket.expanded = !ticket.expanded;
    this.toggleTarget = !this.toggleTarget;
    this.laboratoryService.toggleTarget.next(this.toggleTarget);
    this.appService.approveReject(ticket.ticket_id, status);
  }
}
