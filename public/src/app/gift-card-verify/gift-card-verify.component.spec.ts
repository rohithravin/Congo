import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftCardVerifyComponent } from './gift-card-verify.component';

describe('GiftCardVerifyComponent', () => {
  let component: GiftCardVerifyComponent;
  let fixture: ComponentFixture<GiftCardVerifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftCardVerifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftCardVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
