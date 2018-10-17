import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantRegConfComponent } from './merchant-reg-conf.component';

describe('MerchantRegConfComponent', () => {
  let component: MerchantRegConfComponent;
  let fixture: ComponentFixture<MerchantRegConfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantRegConfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantRegConfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
