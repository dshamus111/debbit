import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable, EMPTY, of, Subject } from 'rxjs';
import { switchMap, filter, take } from 'rxjs/operators';
import { Router  } from '@angular/router';

import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Debt } from '../models/debt.model';
import { query } from '@angular/animations';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class DebtService {

  selectedDebt$: Subject<number>;

  constructor(
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.selectedDebt$ = new Subject();
  }

  loadDebt(debtId: number) {
    // this.afs.collection('debts').doc(debtId).collection('history')
    // .get().subscribe(snapshot => {
    //   debt.history = snapshot.docs.map(doc => doc.data() as Transaction);
    //   this.selectedDebt$.next(debt);
    // });
    this.selectedDebt$.next(debtId);
  }

  setUpPayment(debt: Debt, amount: number) {
    console.log('HIT');
    const transaction: Transaction = {
      uid: this.afs.createId(),
      transaction_date: new Date(),
      amount,
      from: debt.owes,
      approved: false,
      description: ''
    };

    this.afs.collection('debts').doc(debt.uid)
      .collection('history').doc(transaction.uid)
      .set(transaction);
  }

  confirmPayment(debt: Debt, transaction: Transaction) {
    this.afs.collection('debts').doc(debt.uid)
      .collection('history').doc(transaction.uid).update({
        approved: true
      });
  }
  clearDebtState() {
    this.selectedDebt$.next(null);
  }

  determineNextDate(paymentPeriod, nextPayment) {
    switch (paymentPeriod) {
      case 'Daily':
        return nextPayment.setDate(nextPayment.getDate() + 1);

      case 'Weekly':
        return nextPayment.setDate(nextPayment.getDate() + 7);

      case 'BiWeekly':
        return nextPayment.setDate(nextPayment.getDate() + 14);

      case 'Monthly':
        return nextPayment.setMonth(nextPayment.getMonth() + 1);

      case 'Yearly':
        return nextPayment.setFullYear(nextPayment.getFullYear() + 1);
    }
  }
}
