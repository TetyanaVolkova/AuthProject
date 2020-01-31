import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({ providedIn: 'root' })

export class SearchService {
  private SearchUpdated = new Subject();

  constructor() {}
  getSearchUpdateListener() {
    return this.SearchUpdated.asObservable();
  }
  getInputValue( val ) {
    console.log(val);
    this.SearchUpdated.next(val || '');
  }
}
