import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantProductComponent } from './merchantproduct.component';

describe('MerchantProductComponent', () => {
  let component: MerchantProductComponent;
  let fixture: ComponentFixture<MerchantProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
