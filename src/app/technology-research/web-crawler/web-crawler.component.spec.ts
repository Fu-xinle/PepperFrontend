import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebCrawlerComponent } from './web-crawler.component';

describe('WebCrawlerComponent', () => {
  let component: WebCrawlerComponent;
  let fixture: ComponentFixture<WebCrawlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebCrawlerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebCrawlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
