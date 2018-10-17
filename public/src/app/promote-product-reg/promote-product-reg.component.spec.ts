import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoteProductRegComponent } from './promote-product-reg.component';

describe('PromoteProductRegComponent', () => {
  let component: PromoteProductRegComponent;
  let fixture: ComponentFixture<PromoteProductRegComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoteProductRegComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoteProductRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
