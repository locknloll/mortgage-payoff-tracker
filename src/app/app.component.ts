import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment } from './payment';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mortgage-payoff-tracker';

  mortgageInfo: any = {}

  payments: Payment[] = []

  constructor(private store: AngularFirestore) {
    this.calculatePayments(this.payments);
    this.getTrashData().subscribe((data: any) => {
      console.log("trash data = " + JSON.stringify(data));
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
      const itemizedPayment = {
        id: p.id,
        paymentDate: p.paymentDate,
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