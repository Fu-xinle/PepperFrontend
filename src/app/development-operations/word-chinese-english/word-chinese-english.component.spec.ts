import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordChineseEnglishComponent } from './word-chinese-english.component';

describe('WordChineseEnglishComponent', () => {
  let component: WordChineseEnglishComponent;
  let fixture: ComponentFixture<WordChineseEnglishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WordChineseEnglishComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordChineseEnglishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
