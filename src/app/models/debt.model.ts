import { User } from './user.model';
import { Transaction } from './transaction.model';

export enum Period {
  Once = 'Once',
  Daily = 'Daily',
  Weekly = 'Weekly',
  BiWeekly = 'Bi Weekly',
  Monthly = 'Monthly',
  Yearly = 'Yearly'
}
/*
Debt model

id: unique id of debt
name: name of debt
owes: who owes the debt
owed_to: who is the debt owed to
amount_paid: how much the amount is payed already, calculated via transaction addition
total_amount_owed: how much the debt is initially worth
history: transaction history over the course of the debt
debt_start: the day of the debt start
payment_period: what will the payment be in increments
payment_amount: how much will be paid in the next installment
debt_end: when the debt will be paid in full, subject to change
pending: whether or not the debt was confirmed by the sender

interest: any percent interest applied to the amount (used in future update)
*/

export interface Debt {
  uid: string;
  name: string;
  owes: User;
  owed_to: User;
  amount_paid: number;
  total_amount_owed: number;
  history: Transaction[];
  debt_start: any | Date;
  payment_period: Period;
  payment_amount: number;
  set_payment: number;
  number_of_payments: number;
  debt_end: any | Date;
  approved: boolean;
  complete: boolean;
  interest?: number;
  description?: string;
  next_payment?: any | Date;
}
