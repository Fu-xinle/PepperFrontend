import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBiComponent } from './home-bi.component';

describe('HomeBiComponent', () => {
  let component: HomeBiComponent;
  let fixture: ComponentFixture<HomeBiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeBiComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeBiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
