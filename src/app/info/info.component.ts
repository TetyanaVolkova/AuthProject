import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../app.service';
import { NgForm } from '@angular/forms';
import { LaboratoryService } from '../../app/laboratories/laboratory.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  @Input() lable: string;
  @Input() labAtrr;
  @Input() lab;
  @Input() labReg;
  public toggleEdit = true;

  constructor(private appService: AppService,
              private laboratoryService: LaboratoryService) { }

  ngOnInit() {
  }

  editLab( event, name, form: NgForm ) {
    this.laboratoryService.onOpen( event, this.lab );
    form.resetForm();
    this.toggleEdit = !this.toggleEdit;
    let id = null;
    let crs_id = null;
    if ( this.labReg === 'laboratory') {
      id = this.lab.lab_id;
      crs_id = this.lab.crs_lab.crs_id;
    } else if ( this.labReg === 'regulatory' ) {
      id = this.lab.id;
      crs_id = this.lab.crs_id;
    }
    this.appService.addPost( id, crs_id, this.labAtrr, this.lab[this.labAtrr] || '', name || '', this.labReg, 'edited' );
  }

}
