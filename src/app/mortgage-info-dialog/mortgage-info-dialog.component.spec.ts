import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MortgageInfoDialogComponent } from './mortgage-info-dialog.component';

describe('MortgageInfoDialogComponent', () => {
  let component: MortgageInfoDialogComponent;
  let fixture: ComponentFixture<MortgageInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MortgageInfoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MortgageInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
