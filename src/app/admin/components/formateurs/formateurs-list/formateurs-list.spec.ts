import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormateursList } from './formateurs-list';

describe('FormateursList', () => {
  let component: FormateursList;
  let fixture: ComponentFixture<FormateursList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormateursList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormateursList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
