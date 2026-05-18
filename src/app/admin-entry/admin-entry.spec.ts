import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEntry } from './admin-entry';

describe('AdminEntry', () => {
  let component: AdminEntry;
  let fixture: ComponentFixture<AdminEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEntry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEntry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
