import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewImageModalComponent } from './new-image-modal.component';

describe('NewImageModalComponent', () => {
  let component: NewImageModalComponent;
  let fixture: ComponentFixture<NewImageModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewImageModalComponent]
    });
    fixture = TestBed.createComponent(NewImageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
