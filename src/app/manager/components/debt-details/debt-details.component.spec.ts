import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtDetailsComponent } from './debt-details.component';

describe('DebtDetailsComponent', () => {
  let component: DebtDetailsComponent;
  let fixture: ComponentFixture<DebtDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebtDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
