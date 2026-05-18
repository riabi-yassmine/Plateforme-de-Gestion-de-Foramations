import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatsList } from './candidats-list';

describe('CandidatsList', () => {
  let component: CandidatsList;
  let fixture: ComponentFixture<CandidatsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
