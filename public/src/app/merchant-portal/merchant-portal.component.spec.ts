import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantPortalComponent } from './merchant-portal.component';

describe('MerchantPortalComponent', () => {
  let component: MerchantPortalComponent;
  let fixture: ComponentFixture<MerchantPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
