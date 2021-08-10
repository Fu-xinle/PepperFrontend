import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgorithmDesignComponent } from './algorithm-design.component';

describe('AlgorithmDesignComponent', () => {
  let component: AlgorithmDesignComponent;
  let fixture: ComponentFixture<AlgorithmDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlgorithmDesignComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlgorithmDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
