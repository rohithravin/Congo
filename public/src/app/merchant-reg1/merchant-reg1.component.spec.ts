import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantReg1Component } from './merchant-reg1.component';

describe('MerchantReg1Component', () => {
  let component: MerchantReg1Component;
  let fixture: ComponentFixture<MerchantReg1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantReg1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantReg1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
