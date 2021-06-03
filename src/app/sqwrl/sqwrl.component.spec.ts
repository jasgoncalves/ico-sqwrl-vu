import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqwrlComponent } from './sqwrl.component';

describe('SqwrlComponent', () => {
  let component: SqwrlComponent;
  let fixture: ComponentFixture<SqwrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SqwrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SqwrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
