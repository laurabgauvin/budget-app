import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsCreateDialogComponent } from './accounts-create-dialog.component';

describe('AccountsCreateDialogComponent', () => {
  let component: AccountsCreateDialogComponent;
  let fixture: ComponentFixture<AccountsCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsCreateDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
