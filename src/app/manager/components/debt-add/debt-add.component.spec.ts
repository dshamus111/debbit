import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtAddComponent } from './debt-add.component';

describe('DebtAddComponent', () => {
  let component: DebtAddComponent;
  let fixture: ComponentFixture<DebtAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebtAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
