import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-ticket-element',
  templateUrl: './ticket-element.component.html',
  styleUrls: ['./ticket-element.component.css']
})
export class TicketElementComponent implements OnInit, OnDestroy {
  public tickets;
  private ticketSub: Subscription;
  @Input() labId: string;
  @Input() ticketatr: string;
  @Input() status: string;

  constructor ( private appService: AppService,
                private cd: ChangeDetectorRef ) {}

  ngOnInit() {
    this.tickets = this.appService.tickets;
  }
  ngOnDestroy() {
  }
}
