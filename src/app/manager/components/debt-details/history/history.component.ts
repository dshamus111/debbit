import { Component, OnInit, Input } from '@angular/core';
import { Transaction } from 'src/app/models/transaction.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  @Input() history: Transaction[];

  constructor() { }

  ngOnInit(): void {
  }

}
