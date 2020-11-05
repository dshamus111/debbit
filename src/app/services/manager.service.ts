import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable, EMPTY } from 'rxjs';
import { switchMap, filter, take } from 'rxjs/operators';
import { Router  } from '@angular/router';

import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Debt } from '../models/debt.model';
import { query } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  debtsCollection: AngularFirestoreCollection<any>;
  usersCollection: AngularFirestoreCollection<any>;

  owes$: Observable<Debt[]>;
  owed$: Observable<Debt[]>;

  constructor(private afs: AngularFirestore) {
    this.debtsCollection = this.afs.collection('debts');
    // this.usersCollection = this.afs.collection('users');
  }

  getOwesDebts(uid: string) {

  }

  getOwedDebts(uid: string) {

  }

  addDebt(debt: Debt) {

    // Check to see if debt is valid/fill in any other data
    this.afs.collection('users', ref =>
      ref.where('email', '==', debt.owed_to)
    ).get()
    .subscribe(snapshot => {
      debt.uid = this.afs.createId();
      debt.owed_to = snapshot.docs[0].data() as User;
      this.debtsCollection.doc(debt.uid).set(debt);
    });
  }

  searchUser(sub) {
    return sub.pipe(
      filter(val => !!val), // filter empty string
      switchMap(offset => {
        return this.afs.collection('users', ref =>
        ref.orderBy('email').startAt(offset).endAt(offset + '\uf8ff').limit(5))
        .valueChanges();
      }));
    }

  clear() {

  }

}
