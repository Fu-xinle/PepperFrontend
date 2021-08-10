import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeEarthComponent } from './home-earth.component';

describe('HomeEarthComponent', () => {
  let component: HomeEarthComponent;
  let fixture: ComponentFixture<HomeEarthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeEarthComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeEarthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
