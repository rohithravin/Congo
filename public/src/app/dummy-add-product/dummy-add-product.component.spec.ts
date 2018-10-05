import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DummyAddProductComponent } from './dummy-add-product.component';

describe('DummyAddProductComponent', () => {
  let component: DummyAddProductComponent;
  let fixture: ComponentFixture<DummyAddProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DummyAddProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyAddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
