import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTransferComponent } from './transaction-transfer.component';

describe('TransactionTransferComponent', () => {
  let component: TransactionTransferComponent;
  let fixture: ComponentFixture<TransactionTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionTransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
