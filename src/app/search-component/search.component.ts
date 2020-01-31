import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SearchService } from '../search-component/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @Input() parentName: string;
  name = '';
  private searchString;

  constructor( private searchService: SearchService ) {
  }
  onKey (event, val) {
    this.searchService.getInputValue( val );
  }
}
