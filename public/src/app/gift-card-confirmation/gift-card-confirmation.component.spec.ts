import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftCardConfirmationComponent } from './gift-card-confirmation.component';

describe('GiftCardConfirmationComponent', () => {
  let component: GiftCardConfirmationComponent;
  let fixture: ComponentFixture<GiftCardConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftCardConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftCardConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
