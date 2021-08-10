import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDesignVisualComponent } from './form-design-visual.component';

describe('FormDesignVisualComponent', () => {
  let component: FormDesignVisualComponent;
  let fixture: ComponentFixture<FormDesignVisualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormDesignVisualComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDesignVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
