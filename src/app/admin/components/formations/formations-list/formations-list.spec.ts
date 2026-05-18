import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationsList } from './formations-list';

describe('FormationsList', () => {
  let component: FormationsList;
  let fixture: ComponentFixture<FormationsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormationsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormationsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
