import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })

export class RegulatoryService {
  private regulatory;
  private RegulatoryUpdated = new Subject();
  private BACKEND_URL = environment.BACKEND_URL;

  constructor( private http: HttpClient) {}
  getRegulatory() {
    this.http
      .get<{ message: string; regulatory: {} }>(
        this.BACKEND_URL + '/api/regulatory_list'
      )
      .subscribe(postData => {
        this.regulatory = postData;
        this.RegulatoryUpdated.next([...this.regulatory]);
      });
  }
  getRegulatoryUpdateListener() {
    return this.RegulatoryUpdated.asObservable();
  }
}
