import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, EMPTY } from 'rxjs';
import { Debt } from '../models/debt.model';
import { switchMap, tap, map } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { User } from '../models/user.model';
import { ManagerService } from '../services/manager.service';
import { MatDialog } from '@angular/material/dialog';
import { DebtAddComponent } from './components/debt-add/debt-add.component';
import { DebtService } from '../services/debt.service';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {

  owesCollection: AngularFirestoreCollection<Debt>;
  owedCollection: AngularFirestoreCollection<Debt>;

  owes$: Observable<Debt[]>;
  owed$: Observable<Debt[]>;

  viewMode: string;

  constructor(
    public auth: AuthService,
    private afs: AngularFirestore,
    public manager: ManagerService,
    public debtService: DebtService,
    public dialog: MatDialog
    ) { }

  ngOnInit() {

    this.viewMode = 'IOWE';

    this.owes$ = this.auth.user$.pipe(
      switchMap(user => {
        this.owesCollection = this.afs.collection('debts', ref => {
          return ref.where('owes.uid', '==', user.uid);
        });
        return this.owesCollection.valueChanges()
        .pipe(
          map(debts => {
            return debts.map(debt => {
              return {
                ...debt,
                next_payment: debt.next_payment.toDate(),
              };
            });
          })
        );
      })
    );

    this.owed$ = this.auth.user$.pipe(
      switchMap(user => {
        this.owedCollection = this.afs.collection('debts', ref => {
          console.log(user.uid)
          return ref.where('owed_to.uid', '==', user.uid);
        });
        return this.owedCollection.valueChanges()
        .pipe(
          map(debts => {
            return debts.map(debt => {
              return {
                ...debt,
                next_payment: debt.next_payment.toDate(),
              };
            });
          })
        );
      })
    );

  }

  openAddWindow() {

    const dialogRef = this.dialog.open(DebtAddComponent, {
      data: {},
      panelClass: 'my-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  loadViewMode(view) {
    this.viewMode = view;
  }

}
