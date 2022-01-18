import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanBanComponent } from './kan-ban.component';

describe('KanBanComponent', () => {
  let component: KanBanComponent;
  let fixture: ComponentFixture<KanBanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KanBanComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KanBanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
