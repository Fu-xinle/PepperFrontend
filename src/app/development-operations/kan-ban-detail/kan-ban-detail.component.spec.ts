import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanBanDetailComponent } from './kan-ban-detail.component';

describe('KanBanDetailComponent', () => {
  let component: KanBanDetailComponent;
  let fixture: ComponentFixture<KanBanDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KanBanDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KanBanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
