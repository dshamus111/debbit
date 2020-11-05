import { Component, OnInit, Input, OnChanges, OnDestroy, Inject } from '@angular/core';
import { DebtService } from 'src/app/services/debt.service';
import { tap, switchMap, combineLatest, map } from 'rxjs/operators';
import { Observable, Subscription, Subject } from 'rxjs';
import { Debt } from 'src/app/models/debt.model';
import { Transaction } from 'src/app/models/transaction.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DialogData } from '../debt-add/debt-add.component';

@Component({
  selector: 'app-debt-details',
  templateUrl: './debt-details.component.html',
  styleUrls: ['./debt-details.component.scss']
})
export class DebtDetailsComponent implements OnInit, OnDestroy {

  @Input() viewMode: string;
  debt$: Observable<Debt>;
  amount: number;

  debt: Debt;
  history: Transaction[];

  debtSub: Subscription;
  historySub: Subscription;

  constructor(
    private debtService: DebtService,
    private afs: AngularFirestore,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.amount = 0;

    this.debtSub = this.debtService.selectedDebt$
      .pipe(
        switchMap(id => {
          return this.afs.collection('debts').doc(`${id}`)
            .valueChanges()
            .pipe(
              map(debt => debt as Debt),
            );
        })
      )
      .subscribe(debt => {
        if (debt) {
          this.debt = debt;
        }
      });

    this.historySub = this.debtService.selectedDebt$
      .pipe(
        switchMap(id => {
          return this.afs.collection('debts').doc(`${id}`).collection('history')
            .valueChanges()
            .pipe(
              // map(history => history.filter(transaction => transaction.approved === false) as Transaction[])
              map(history => history as Transaction[])
            );
        })
      )
      .subscribe(history => {
        if (history) {
          this.history = history;
        } else {
          this.history = [];
        }
      });

  }

  ngOnDestroy() {
    this.debtSub.unsubscribe();
    this.historySub.unsubscribe();
  }

  updateAmount(event) {
    this.amount = event * (this.debt.total_amount_owed - this.debt.amount_paid);
  }

  determineProgressAmount() {
    const paid = this.debt.amount_paid;
    const total = this.debt.total_amount_owed;
    const percent = (paid / total) * 100;
    if (percent < 34) {
      return {
        'background-color': 'red',
        width: percent + '%'
      };
    }
    if (percent < 67) {
      return {
        'background-color': 'yellow',
        width: percent + '%'
      };
    }

    return {
      'background-color': 'green',
      width: percent + '%'
    };
  }

  determinePendingProgress(pendingAmount: number) {
    return {
      width: ((this.debt.amount_paid + pendingAmount) / this.debt.total_amount_owed) * 100 + '%'
    };
  }

  openTransactionDialog() {
    if (this.amount > 0) {
      const dialogRef = this.dialog.open(TransactionDialogComponent, {
        width: '30vw',
        height: '70vh',
        data: {debt: this.debt, amount: this.amount}
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      })
    } else {
      alert('You cannot pay with an amount of 0');
    }
  }

  confirmPayment(transaction) {
    this.debtService.confirmPayment(this.debt, transaction);
  }

  clear() {
    this.debtService.clearDebtState();
  }

}

@Component({
  selector: 'app-transaction-dialog',
  templateUrl: 'transaction-dialog.html'
})
export class TransactionDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {debt: Debt, amount: number},
    private debtService: DebtService
  ) {}

  ngOnInit() {
    console.log(this.data);
  }

  closeDialog() {
    this.dialogRef.close(0);
  }

  setUpPayment() {
    this.debtService.setUpPayment(this.data.debt, this.data.amount);
  }
}
