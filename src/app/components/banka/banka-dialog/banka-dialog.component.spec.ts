import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankaDialogComponent } from './banka-dialog.component';

describe('BankaDialogComponent', () => {
  let component: BankaDialogComponent;
  let fixture: ComponentFixture<BankaDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BankaDialogComponent]
    });
    fixture = TestBed.createComponent(BankaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
