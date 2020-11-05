import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtItemComponent } from './debt-item.component';

describe('DebtItemComponent', () => {
  let component: DebtItemComponent;
  let fixture: ComponentFixture<DebtItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebtItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
