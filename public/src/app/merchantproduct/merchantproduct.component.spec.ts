import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantproductComponent } from './merchantproduct.component';

describe('MerchantproductComponent', () => {
  let component: MerchantproductComponent;
  let fixture: ComponentFixture<MerchantproductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantproductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
