import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Payment } from '../payment';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.css']
})
export class PaymentDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PaymentDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: PaymentDialogData) { }

  ngOnInit(): void {
  }

}

export interface PaymentDialogData {
  payment: Partial<Payment>;
  enableDelete: boolean;
}

export interface PaymentDialogResult {
  payment: Payment;
  delete?: boolean;
}
