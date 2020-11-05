import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);
const db = admin.firestore()
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


// Debt cloud functions

// On debt creation, set the payment amount equal to the total_amount / number of payments
export const initPaymentAmount = functions.firestore
  .document('debts/{debtId}')
  .onCreate(snapshot => {

    const debtData = snapshot.data();

    if (debtData) {
      return snapshot.ref.update({
        set_payment: Math.ceil(debtData.total_amount_owed / debtData.number_of_payments),
        payment_amount: Math.ceil(debtData.total_amount_owed / debtData.number_of_payments)
      })
    }
    return;
  });


// Transaction cloud functions
export const paymentConfirmation = functions.firestore
  .document('debts/{debtId}/history/{transactionId}')
  .onUpdate((change, context) => {
    const newValue = change.after.data();

    if(newValue && newValue.approved === true) {
      const debtId = context.params.debtId;
      return db.collection('debts').doc(debtId)
      .get()
      .then(doc => {
        const data = doc.data();
        if(data){
          return db.collection('debts').doc(debtId)
          .update({
            amount_paid: data.amount_paid + newValue.amount,
            payment_amount: data.payment_amount - newValue.amount,
            complete: (data.amount_paid + newValue.amount) >= data.total_amount_owed ? true : false
          })
        }
        return;
      })
      .catch(err => console.log(err))

    }
    return;
  })

// Scheduling

// Check every day to see if there are debts that need to be updated
export const scheduleRunner = functions.pubsub.schedule('0 1 * * *').onRun(async context => {
  const now = admin.firestore.Timestamp.now();
  console.log('Check time is ', now);
  const query = db.collection('debts').where('next_payment', '<', now).where('complete', '==', false);
  const tasks = await query.get();

  const jobs: Promise<any>[] = [];
  tasks.forEach(doc => {
    console.log('Checking ', doc);
    const data = doc.data();
    //determine how many payments are left and next payment date
    let newNumPayments = 1;
    let nextPayment = data.debt_end;
    if(data.number_of_payments > 1) {
      newNumPayments = data.number_of_payments - 1;
      nextPayment = new Date(determineNextDate(data.payment_period, data.next_payment.toDate()))
      if (nextPayment > data.debt_end) {
        newNumPayments = 1;
        nextPayment = data.debt_end;
      }
    }
    //reset set_payment based off of payment_amount value
    //negative values will be distributed amongst the remaining payments for now
    //can have a value that determines how the extra payments can be distrubuted
    let newSetPayment = data.set_payment;
    if(data.payment_amount <= 0) {
      const distribute = Math.abs(data.payment_amount) / newNumPayments;
      newSetPayment = newSetPayment - distribute;
    } else {
      newSetPayment = Math.ceil((data.total_amount_owed - data.amount_paid) / newNumPayments)
    }
    //set payment_amount to be the new set_payment
    const job = doc.ref.update({
      number_of_payments: newNumPayments,
      next_payment: nextPayment,
      set_payment: newSetPayment,
      payment_amount: newSetPayment
    })
    .then(() => console.log('Debts updated!'))
    .catch(err => console.log(err))

    jobs.push(job);
  })
    return await Promise.all(jobs);
});

function determineNextDate(paymentPeriod: any, nextPayment: Date) {
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
  return nextPayment;
}

