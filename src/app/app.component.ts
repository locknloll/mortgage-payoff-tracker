import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment } from './payment';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MortgageInfoDialogComponent, MortgageInfoDialogResult } from './mortgage-info-dialog/mortgage-info-dialog.component';
import { PaymentDialogComponent, PaymentDialogResult } from './payment-dialog/payment-dialog.component';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mortgage-payoff-tracker';

  mortgageInfo: any = {}
  hasMortgageInfo: boolean = false;
  displayedColumns = [
    'paymentDate',
    'paymentAmount',
    'principalAmount',
    'interestAmount',
    'escrowAmount',
    'remainingBalance',
    'action'
  ];
  itemizedPayments: any[] = [];
  payments: Payment[] = []

  constructor(private store: AngularFirestore,
              private dialog: MatDialog) {
    this.getMortgageInfo().subscribe((settings: any) => {
      this.mortgageInfo = (settings === undefined) ? {} : settings;
      this.hasMortgageInfo = (JSON.stringify(this.mortgageInfo) !== '{}');

      this.getPayments().subscribe((payments: Payment[]) => {
        this.itemizedPayments = this.calculatePayments(payments);
      })
    })
  }

  getPayments(): Observable<Payment[]> {
    return this.store.collection('payment', ref => ref.orderBy('paymentDate'))
      .valueChanges({ idField: 'id' }) as Observable<Payment[]>;
  }

  newPayment(): void {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '350px',
      data: { payment: {} },
    });
    dialogRef.afterClosed()
      .subscribe((result: PaymentDialogResult | undefined) => {
        if (!result) {
          return;
        }
        this.store.collection('payment').add(result.payment);
      })
  }

  editPayment(payment: Payment): void {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '350px',
      data: { payment },
    });
    dialogRef.afterClosed()
      .subscribe((result: PaymentDialogResult | undefined) => {
        if (!result) {
          return;
        }
        this.store.collection('payment').doc(payment.id).update(payment);
      })
  }

  deletePayment(id: string) {
    this.store.collection('payment').doc(id).delete();
  }

  getMortgageInfo(): Observable<any> {
    return this.store.collection('app.settings').doc('mortgage').valueChanges() as Observable<any>;
  }

  editMortgageInfo() {
    const dialogRef = this.dialog.open(MortgageInfoDialogComponent, {
      width: '350px',
      data: { mortgage: this.mortgageInfo },
    });
    dialogRef.afterClosed()
      .subscribe((result: MortgageInfoDialogResult | undefined) => {
        if (!result) {
          return;
        }
        result.mortgage['interestRate'] /= 100;
        result.mortgage['currentPrincipal'] = result.mortgage.startingPrincipal;
        this.store.collection('app.settings').doc('mortgage').set(result.mortgage);
      })
  }

  getTrashData(): Observable<any> {
    return this.store.collection('trash').valueChanges() as Observable<any>;
  }

  calculatePayments(payments: Payment[]): any[] {
    const itemizedPayments: any[] = [];
    let currentPrincipal = this.mortgageInfo.startingPrincipal;
    payments.forEach((p: Payment) => {
      const pmtAmt = p.paymentAmount;
      const interestAmount = currentPrincipal * this.mortgageInfo.interestRate / 12;
      const principalAmount = (pmtAmt - interestAmount - this.mortgageInfo.escrow);
      currentPrincipal -= principalAmount;
      let paymentDateMillis = (p.paymentDate as Timestamp).toMillis();
      const itemizedPayment = {
        id: p.id,
        paymentDate: new Date(paymentDateMillis),
        escrowAmount: this.mortgageInfo.escrow,
        paymentAmount: p.paymentAmount,
        interestAmount: interestAmount,
        principalAmount: principalAmount,
        remainingBalance: currentPrincipal
      };
      console.log("itemized payment = " + JSON.stringify(itemizedPayment));
      itemizedPayments.push(itemizedPayment);
    })
    this.mortgageInfo.currentPrincipal = currentPrincipal;
    return itemizedPayments;
  }
}