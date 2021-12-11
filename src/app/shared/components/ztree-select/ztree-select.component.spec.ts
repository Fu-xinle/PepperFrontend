import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZtreeSelectComponent } from './ztree-select.component';

describe('ZtreeSelectComponent', () => {
  let component: ZtreeSelectComponent;
  let fixture: ComponentFixture<ZtreeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ZtreeSelectComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZtreeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
