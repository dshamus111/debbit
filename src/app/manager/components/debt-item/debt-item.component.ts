import { Component, OnInit, Input } from '@angular/core';
import { Debt } from 'src/app/models/debt.model';

@Component({
  selector: 'app-debt-item',
  templateUrl: './debt-item.component.html',
  styleUrls: ['./debt-item.component.scss']
})
export class DebtItemComponent implements OnInit {

  @Input() debt: Debt;

  now = new Date();

  constructor() { }

  ngOnInit() {}



}
