import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mortgage-info-dialog',
  templateUrl: './mortgage-info-dialog.component.html',
  styleUrls: ['./mortgage-info-dialog.component.css']
})
export class MortgageInfoDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MortgageInfoDialogComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: MortgageInfoDialogData) { }

  ngOnInit(): void {
  }

}

export interface MortgageInfoDialogData {
  mortgage: Partial<any>;
  enableDelete: boolean;
}

export interface MortgageInfoDialogResult {
  mortgage: any;
  delete?: boolean;
}
