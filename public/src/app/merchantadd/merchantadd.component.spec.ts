import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantaddComponent } from './merchantadd.component';

describe('MerchantaddComponent', () => {
  let component: MerchantaddComponent;
  let fixture: ComponentFixture<MerchantaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
