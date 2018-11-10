import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamRegistrationComponent } from './stream-registration.component';

describe('StreamRegistrationComponent', () => {
  let component: StreamRegistrationComponent;
  let fixture: ComponentFixture<StreamRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
