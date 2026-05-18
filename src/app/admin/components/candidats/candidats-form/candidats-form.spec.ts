import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatsForm } from './candidats-form';

describe('CandidatsForm', () => {
  let component: CandidatsForm;
  let fixture: ComponentFixture<CandidatsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
