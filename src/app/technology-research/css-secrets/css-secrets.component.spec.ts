import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CssSecretsComponent } from './css-secrets.component';

describe('CssSecretsComponent', () => {
  let component: CssSecretsComponent;
  let fixture: ComponentFixture<CssSecretsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CssSecretsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CssSecretsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
