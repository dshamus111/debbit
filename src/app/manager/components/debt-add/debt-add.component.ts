import { Component, OnInit, Inject, Input} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Debt, Period } from 'src/app/models/debt.model';
import { ManagerService } from 'src/app/services/manager.service';
import { User } from 'src/app/models/user.model';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { take, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

export interface DialogData {
  debt_type: string;
}

@Component({
  selector: 'app-debt-add',
  templateUrl: './debt-add.component.html',
  styleUrls: ['./debt-add.component.scss']
})
export class DebtAddComponent implements OnInit {

  @Input() whoOwes: boolean; // 0 if I owe, 1 if you owe. Determines view layout

  debt: Debt;
  viewMode: number; // 0 for #payments view 1 for date view
  periods = [];
  periodType: Period;
  debtForm: FormGroup;

  offset = new Subject();

  constructor(
    public dialogRef: MatDialogRef<DebtAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private manager: ManagerService,
    private auth: AuthService,
    private builder: FormBuilder
  ) {
    this.viewMode = 0;
  }

  ngOnInit() {
    this.debtForm = this.builder.group({
        name: ['', [Validators.required, Validators.maxLength(30)]],
        owes: [''],
        owed_to: [''],
        amount_paid: 0,
        total_amount_owed: ['', Validators.required],
        debt_start: new Date(),
        payment_period: ['', Validators.required],
        number_of_payments: ['', Validators.required],
        debt_end: null,
        pending: false,
        approved: false,
        complete: false,
        interest: null,
        description: '',
        next_payment: null
    });

    // Add user depending on whoOwes variable.
    // TODO: Add conditional based on whoOwes Input variable

    this.auth.user$.pipe(take(1)).subscribe(user => {
      this.debtForm.get('owes').setValue(user);
    });

    this.periods = Object.keys(Period);

    this.debtForm.get('payment_period').valueChanges
      .subscribe(period => {
        // Disable # of payments if period is one time
        if (period === 'Once') {
          this.debtForm.get('number_of_payments').setValue(1);
          this.debtForm.get('number_of_payments').disable();
        } else {
          this.debtForm.get('number_of_payments').enable();
        }
      });

    this.debtForm.get('number_of_payments').valueChanges
      .subscribe(_ => {
        this.updateEndDate();
        this.updatePaymentAmounts();
      });

    this.debtForm.get('total_amount_owed').valueChanges
     .subscribe(_ => {
      this.updatePaymentAmounts();
    });

    this.manager.searchUser(this.offset).subscribe(list => {
      console.log(list);
    });

    this.debtForm.get('owed_to').valueChanges
      .subscribe((email: string) => {
        this.offset.next(email.toLowerCase());
      });

  }

  // Update the amount paid per payment
  updatePaymentAmounts() {
    // const amount: number = this.debtForm.get('total_amount_owed').value;
    // const numPayments: number = this.debtForm.get('number_of_payments').value;

    // if(amount > 0 && numPayments > 0) {
    //   const payment_amount = amount / numPayments;

    //   this.debtForm.get('payment_amount').setValue(payment_amount);
    // }
  }

  // Calculate end date and payment amount based on period and number of payments
  updateEndDate() {
    const paymentPeriod = this.debtForm.get('payment_period').value;
    const numPayments: number = this.debtForm.get('number_of_payments').value;
    if (numPayments > 0 && paymentPeriod !== null) {
      let increment = 0;
      const startDate = this.debtForm.get('debt_start').value;
      const nextPayment = new Date();
      const endDate = new Date();
      switch (paymentPeriod) {
        case 'Daily':
          increment = 1 * numPayments;
          nextPayment.setDate(startDate.getDate() + 1);
          endDate.setDate(startDate.getDate() + increment);
          break;

        case 'Weekly':
          increment = 7 * numPayments;
          nextPayment.setDate(startDate.getDate() + 7);
          endDate.setDate(startDate.getDate() + increment);
          break;

        case 'BiWeekly':
          increment = 14 * numPayments;
          nextPayment.setDate(startDate.getDate() + 14);
          endDate.setDate(startDate.getDate() + increment);
          break;

        case 'Monthly':
          increment = 1 * numPayments;
          nextPayment.setMonth(startDate.getMonth() + 1);
          endDate.setMonth(startDate.getMonth() + increment);
          break;

        case 'Yearly':
          increment = 1 * numPayments;
          nextPayment.setFullYear(startDate.getFullYear() + 1);
          endDate.setFullYear(startDate.getFullYear() + increment);
          break;
      }
      console.log(endDate);
      this.debtForm.get('next_payment').setValue(nextPayment);
      this.debtForm.get('debt_end').setValue(endDate);
    }
  }

  createDebt(data: FormGroup) {
    // Validate data
    if (this.debtForm.valid) {
      const debt: Debt = data.getRawValue();
      console.log('Debt: ', debt);
      this.manager.addDebt(debt);
    } else {
      alert('Your form is not valid');
    }
  }

  close(): void {
    this.dialogRef.close();
  }


}
