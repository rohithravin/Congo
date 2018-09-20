import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutConfComponent } from './checkout-conf.component';

describe('CheckoutConfComponent', () => {
  let component: CheckoutConfComponent;
  let fixture: ComponentFixture<CheckoutConfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutConfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutConfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
