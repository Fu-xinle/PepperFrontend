import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormManageComponent } from './form-manage.component';

describe('FormManageComponent', () => {
  let component: FormManageComponent;
  let fixture: ComponentFixture<FormManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormManageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
