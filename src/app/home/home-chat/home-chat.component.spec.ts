import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeChatComponent } from './home-chat.component';

describe('HomeChatComponent', () => {
  let component: HomeChatComponent;
  let fixture: ComponentFixture<HomeChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeChatComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
