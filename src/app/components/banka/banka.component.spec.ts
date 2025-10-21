import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankaComponent } from './banka.component';

describe('BankaComponent', () => {
  let component: BankaComponent;
  let fixture: ComponentFixture<BankaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BankaComponent]
    });
    fixture = TestBed.createComponent(BankaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
