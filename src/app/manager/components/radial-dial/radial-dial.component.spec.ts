import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadialDialComponent } from './radial-dial.component';

describe('RadialDialComponent', () => {
  let component: RadialDialComponent;
  let fixture: ComponentFixture<RadialDialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadialDialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadialDialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
