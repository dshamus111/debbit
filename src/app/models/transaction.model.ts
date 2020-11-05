import { User } from './user.model';
import { Debt } from './debt.model';

/*
Transaction model

id: unique id of transaction
transaction_date: date of transaction
amount: amount offered
to: what debt is the money going to
from: who is sending the money
approved: whether the sender got the money
description: details pertaining to the transaction
*/
export interface Transaction {
  uid: string;
  transaction_date: Date;
  amount: number;
  // to: Debt;
  from: User;
  approved: boolean;
  description: string;
}
