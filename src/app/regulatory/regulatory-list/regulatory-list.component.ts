import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { RegulatoryService } from '../regulatory.service';
import { AppService } from '../../app.service';
import { AuthService } from '../../auth/auth.service';
import { SearchService } from '../../search-component/search.service';
import { HistoryService } from '../../history/history.service';
import { DOCUMENT } from "@angular/common";
import { PageEvent } from '@angular/material/paginator';
import { LaboratoryService } from '../../../app/laboratories/laboratory.service';

@Component({
  selector: 'app-regulatory-list',
  templateUrl: './regulatory-list.component.html',
  styleUrls: ['./regulatory-list.component.css']
})
export class RegulatoryListComponent implements OnInit, OnDestroy {
  objectKeys = Object.keys;
  public crss;
  private crssSub: Subscription;
  private searchSub: Subscription;
  private toggleTargetSub: Subscription;
  private countSub: Subscription;
  private authListenerSub: Subscription;
  private searchString = '';
  private expanded = true;
  private panelOpenState;
  private totalLabs;
  private pageIndex = '0';
  private pageSize = '5';
  private limit;
  private pageSizeOptions = [ 2, 5, 10];
  private userIsAuthenticated;

  constructor ( private regulatoryService: RegulatoryService,
                private authService: AuthService,
                private appService: AppService,
                private laboratoryService: LaboratoryService,
                private cd: ChangeDetectorRef,
                private searchService: SearchService,
                private historyService: HistoryService,
                @Inject(DOCUMENT) private document: any ) {
                }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.cd.markForCheck();
    });
    this.appService.getTickets( 'all', '0', '');
    this.laboratoryService.toggleTarget.next(this.expanded);
    this.toggleTargetSub = this.laboratoryService.toggleTargetUpdateListener()
    .subscribe( ( target ) => {
      this.expanded = <boolean>target;
    });
    this.searchSub = this.searchService.getSearchUpdateListener()
      .subscribe((searchString) => {
        this.searchString = searchString.toString();
        this.pageIndex = '0';
        this.appService.getCrss(this.pageSize, this.pageIndex, this.searchString);
      });
      this.appService.getCrss(this.pageSize, this.pageIndex, this.searchString);
      this.crssSub = this.appService.getCrsUpdateListener()
        .subscribe((crss) => {
          this.crss = crss;
          this.cd.markForCheck();
        });
        this.countSub = this.appService.getCountUpdateListener()
          .subscribe((count) => {
            this.totalLabs = count;
          });
  }

  ngOnDestroy() {
    this.crssSub.unsubscribe();
    this.searchSub.unsubscribe();
    this.countSub.unsubscribe();
    this.toggleTargetSub.unsubscribe();
  }

  onPageChange(pageData: PageEvent) {
    this.pageSize = pageData.pageSize.toString();
    this.limit = pageData.pageSize.toString();
    this.pageIndex = pageData.pageIndex.toString();
    this.appService.getCrss(this.limit, this.pageIndex, this.searchString);
  }

  onOpen ( event, regulatory ) {
    this.laboratoryService.onOpen( event, regulatory );
  }
}
