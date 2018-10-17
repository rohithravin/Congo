import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantReg2Component } from './merchant-reg2.component';

describe('MerchantReg2Component', () => {
  let component: MerchantReg2Component;
  let fixture: ComponentFixture<MerchantReg2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantReg2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantReg2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
