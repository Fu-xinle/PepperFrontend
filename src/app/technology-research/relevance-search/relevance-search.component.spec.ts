import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelevanceSearchComponent } from './relevance-search.component';

describe('RelevanceSearchComponent', () => {
  let component: RelevanceSearchComponent;
  let fixture: ComponentFixture<RelevanceSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RelevanceSearchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelevanceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
