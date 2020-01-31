import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Inject } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { LaboratoryService } from '../laboratory.service';
import { SearchService } from '../../search-component/search.service';
import { AuthService } from '../../auth/auth.service';
import { AppService } from '../../app.service';
import { HistoryService } from '../../history/history.service';
import { DOCUMENT } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-lab-list',
  templateUrl: './lab-list.component.html',
  styleUrls: ['./lab-list.component.css']
})
export class LabListComponent implements OnInit, OnDestroy {
  myControl = new FormControl();
  newLabControl = new FormControl();
  objectKeys = Object.keys;
  public crss;
  private crssSub: Subscription;
  private countSub: Subscription;
  private laboratoryListSub: Subscription;
  private searchSub: Subscription;
  private openSub: Subscription;
  private toggleTargetSub: Subscription;
  private authListenerSub:Subscription;
  private searchString = '';
  private toggleTarget = true;
  public totalLabs;
  public pageIndex = '0';
  public pageSize = '5';
  public pageSizeOptions = [ 2, 5, 10];
  private limit;
  private laboratoryList;
  filteredOptions: Observable<string[]>;
  public userIsAuthenticated;

  constructor(public laboratoryService: LaboratoryService,
              private authService: AuthService,
              private appService: AppService,
              private historyService: HistoryService,
              private cd: ChangeDetectorRef,
              private searchService: SearchService,
              @Inject(DOCUMENT) private document: any) {
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
    this.laboratoryService.toggleTarget.next(this.toggleTarget);
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

      this.toggleTargetSub = this.laboratoryService.toggleTargetUpdateListener()
      .subscribe( ( target ) => {
        this.toggleTarget = <boolean>target;
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
    this.laboratoryListSub = this.appService.laboratoryListUpdatedListener()
      .subscribe((laboratoryList) => {
        const labListWithIDs = [];
        Object.keys(laboratoryList).forEach(element => {
          labListWithIDs.push(laboratoryList[element].lab_id + ' ' + laboratoryList[element].lab_name);
        });
        // console.log(labListWithIDs);
        this.laboratoryList = labListWithIDs;
        this.cd.markForCheck();
      });
  }

  private _filter(value: string): string[] {
    let filterValue = '';
    if ( value ) {
      filterValue = value.toLowerCase();
    }

    return this.laboratoryList.filter(option => option.toLowerCase().includes(filterValue));
  }

  onPageChange(pageData: PageEvent) {
    this.pageSize = pageData.pageSize.toString();
    this.pageIndex = pageData.pageIndex.toString();
    this.limit = pageData.pageSize.toString();
    this.appService.getCrss(this.limit, this.pageIndex, this.searchString);
  }

  addLab ( crsID, laboratory, crs ) {
    this.laboratoryService.onOpen( event, crs );
    let linkLab;
    let labString;
    if ( this.myControl.value ) {
      linkLab = this.myControl.value.split( ' ' );
      linkLab.shift();
      labString = linkLab.join(' ');
    }
    const newVal = this.newLabControl.value;
    this.myControl.reset();
    this.newLabControl.reset();
    let lab_id = null;
    if ( laboratory ) {
      lab_id = laboratory.split( ' ' )[0];
    } else {
      lab_id = new Date().valueOf().toString().substring( 0, 5 );
      console.log(lab_id);
    }
    if ( labString === '' || labString === 'NONE' || labString === undefined) {
      this.appService.addPost( lab_id, crsID, 'lab_name', '', newVal, 'laboratory', 'added');
    } else {
      this.appService.addPost( lab_id, crsID, 'lab_name', '', labString, 'laboratory', 'link');
    }
  }

  ngOnDestroy() {
    this.crssSub.unsubscribe();
    this.countSub.unsubscribe();
    this.searchSub.unsubscribe();
    this.laboratoryListSub.unsubscribe();
    this.toggleTargetSub.unsubscribe();
    this.authListenerSub.unsubscribe();
    // this.openSub.unsubscribe();
  }

  onOpen ( event, lab ) {
    this.myControl.reset();
    this.newLabControl.reset();
    this.laboratoryService.onOpen( event, lab );
  }

  onAddClick() {
    this.myControl.reset();
    this.newLabControl.reset();
  }

  deleteLab(event, lab, lab_reg: string) {
    lab.expanded = !lab.expanded;
    this.toggleTarget = !this.toggleTarget;
    this.laboratoryService.toggleTarget.next(this.toggleTarget);
    this.document.getElementsByClassName('lab_is_open')[0].classList.remove('lab_is_open');
    this.appService.deleteLab(lab.lab_id, lab.crs_lab.crs_id, lab_reg);
  }
}
